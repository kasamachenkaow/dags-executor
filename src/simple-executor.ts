type Task<TArgs> = (args: TArgs) => Promise<void>

type TaskNode<TArgs> = {
  task: Task<TArgs>
  input: TArgs
  children?: TaskNode<unknown>[]
}

export const addTaskChild = <TArgs, TChild>(
  parent: TaskNode<TArgs>,
  child: TaskNode<TChild>,
) => {
  if (!parent.children) {
    parent.children = []
  }

  parent.children.push(child as TaskNode<unknown>)
}

export const simpleDagsExecutor = async <TArgs>(taskNode: TaskNode<TArgs>) => {
  if (taskNode.children && taskNode.children.length !== 0) {
    await Promise.all(taskNode.children.map(simpleDagsExecutor))
  }

  await taskNode.task(taskNode.input)
}
