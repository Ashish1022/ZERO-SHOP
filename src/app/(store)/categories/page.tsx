import { caller } from "@/trpc/server";

const page = async () => {
  const categories = await caller.categories.getMany({});

  return <pre>{JSON.stringify(categories.data, null, 2)}</pre>;
};

export default page;
