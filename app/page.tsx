import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type Task = {
  id: number;
  description: string;
  done: boolean;
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const tasks: Array<Task> = await prisma.tasks.findMany({});

  async function submitTask(formData: FormData) {
    "use server";

    const description = formData.get("description")?.toString() as string;
    if (
      description === "" ||
      description.length === 0 ||
      description.length <= 3 ||
      description.length > 180
    ) {
      return;
    }
    await prisma.tasks.create({
      data: {
        description: description,
        done: false,
      },
    });
    revalidatePath("/");
  }

  return (
    <div className="max-w-[700px] font-sans flex flex-col gap-4 w-full mx-auto">
      <p className="mt-16 text-4xl font-bold">Tasks</p>
      <form action={submitTask} className="flex flex-row gap-2 items-center">
        <input
          placeholder="New task..."
          type="text"
          name="description"
          className="w-full py-2 px-3 border-neutral-800 border rounded-xl"
        />
        <button
          type="submit"
          className="w-fit py-2 px-3 border-neutral-800 border rounded-xl"
        >
          Create
        </button>
      </form>
      <div className="flex flex-col gap-4">
        {tasks.map((task, idx) => (
          <div
            key={idx}
            className="w-full py-2 px-3 border-neutral-800 border rounded-xl"
          >
            <p>{task.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
