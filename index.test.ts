import { expect, test } from 'bun:test'

import { addTaskChild, dagsExecutor } from './src/executor'

test('dagsExecutor', async () => {
  const task = async (args: { name: string }) => {
    console.log(`Hello, ${args.name}!`)
  }

  const task2 = async (args: { name: string; value: number }) => {
    console.log(`Hello, ${args.name} - ${args.value}!`)
  }

  const taskNode = {
    task,
    input: { name: 'Alice' },
    children: [],
  }

  const taskNode2 = {
    task: task2,
    input: { name: 'Bob', value: 42 },
    children: [],
  }

  const taskNode3 = {
    task: task,
    input: { name: 'Charlie' },
    children: [],
  }

  addTaskChild(taskNode, taskNode2)
  addTaskChild(taskNode, taskNode2)
  addTaskChild(taskNode2, taskNode3)
  addTaskChild(taskNode2, taskNode3)
  addTaskChild(taskNode2, taskNode3)

  await dagsExecutor(taskNode)
  expect(true).toBe(true)
})
