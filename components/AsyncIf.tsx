import { ReactNode, Suspense } from "react";

type Props = {
  condition: () => Promise<boolean>;
  otherwise?: ReactNode;
  children: ReactNode;
  loadingFallback?: ReactNode;
};

const AsyncIf = ({
  children,
  condition,
  otherwise,
  loadingFallback,
}: Props) => {
  return (
    <Suspense>
      <SuspendedComponent condition={condition} otherwise={otherwise}>
        {children}
      </SuspendedComponent>
    </Suspense>
  );
};

const SuspendedComponent = async ({
  children,
  condition,
  otherwise,
}: Omit<Props, "loadingFallback">) => {
  return (await condition()) ? children : otherwise;
};

export default AsyncIf;
