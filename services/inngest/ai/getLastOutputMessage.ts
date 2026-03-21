import { cleanMarkdownResponse } from "@/lib/utils";
import { AgentResult } from "@inngest/agent-kit";

export const getLastOutputMessage = (result: AgentResult) => {
  const lastMsg = result.output.at(-1);

  if (lastMsg == null || lastMsg.type !== "text") return;

  return typeof lastMsg.content === "string"
    ? cleanMarkdownResponse(lastMsg.content.trim())
    : cleanMarkdownResponse(lastMsg.content.join("\n").trim());
};
