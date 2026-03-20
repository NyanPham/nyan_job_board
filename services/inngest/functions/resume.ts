import { db } from "@/drizzle/db";
import { inngest } from "../client";
import { eq } from "drizzle-orm";
import { UserResumeTable } from "@/drizzle/schema";
import { env } from "@/data/env/server";
import { updatetUserResume } from "@/features/users/db/userResumes";
import { pdfToText } from "pdf-ts";

export const createdAIsummaryOfUploadedResume = inngest.createFunction(
  {
    id: "create-ai-summary-of-uplodated-resume",
    name: "Create AI Summary Of Uploaded Resume",
  },
  {
    event: "app/resume.uploaded",
  },
  async ({ step, event }) => {
    const { id: userId } = event.user;

    const userResume = await step.run("get-user-resume", async () => {
      return await db.query.UserResumeTable.findFirst({
        where: eq(UserResumeTable.userId, userId),
        columns: { resumeFileUrl: true },
      });
    });

    if (userResume == null) return;

    const resumeText = await step.run("parse-resume-pdf", async () => {
      const response = await fetch(userResume.resumeFileUrl);
      const pdfBuffer = await response.arrayBuffer();
      return await pdfToText(Buffer.from(pdfBuffer));
    });

    if (!resumeText) {
      return;
    }

    const result = await step.ai.infer("create-ai-summary", {
      model: step.ai.models.gemini({
        model: "gemini-2.5-flash",
        apiKey: env.GOOGLE_API_KEY,
      }),
      body: {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Summarize the following resume and extract all key skills, experience, and qualifications. The summary should include all the information that a hiring manager would need to know about the candidate in order to determine if they are a good fit for a job. This summary should be formatted as markdown. Do not return any other text. If the file does not look like a resume return the text 'N/A'.\n\nResume:\n${resumeText}`,
              },
            ],
          },
        ],
      },
    });

    await step.run("save-ai-summary", async () => {
      if (!result.candidates || result.candidates.length === 0) return;
      const part = result.candidates[0].content.parts[0];
      if ('text' in part) {
        let summary = part.text.trim();
        if (summary.startsWith('```markdown')) {
          summary = summary.replace(/^```markdown\s*/, '').replace(/\s*```$/, '');
        }
        if (summary) {
          await updatetUserResume(userId, { aiSummary: summary });
        }
      }
    });
  },
);
