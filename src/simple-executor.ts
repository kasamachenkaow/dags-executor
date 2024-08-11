type Task<TArgs> = (args: TArgs) => Promise<void>

type TaskNode<TArgs> = {
  task: Task<TArgs>
  input: TArgs
  children: TaskNode<unknown>[]
}

export const addTaskChild = <TArgs, TChild>(
  parent: TaskNode<TArgs>,
  child: TaskNode<TChild>,
) => {
  parent.children.push(child as TaskNode<unknown>)
}

export const simpleDagsExecutor = async <TArgs>(taskNode: TaskNode<TArgs>) => {
  const pendingChildren = taskNode.children

  if (pendingChildren.length !== 0) {
    await Promise.all(pendingChildren.map(simpleDagsExecutor))
  }

  await taskNode.task(taskNode.input)
}
