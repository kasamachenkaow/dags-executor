import { expect, test } from 'bun:test'
import { promisify } from 'node:util'

const setTimeoutPromise = promisify(setTimeout)

import { addTaskChild, simpleDagsExecutor } from './simple-executor'

test('dagsExecutor', async () => {
  const results: string[] = []
  const task = async (args: { name: string }) => {
    console.log(`Hello, ${args.name}!`)

    await setTimeoutPromise(5)

    results.push(`task, ${args.name}`)
  }

  const task2 = async (args: { name: string; value: number }) => {
    console.log(`Hello, ${args.name} - ${args.value}!`)

    await setTimeoutPromise(5)

    results.push(`task2, ${args.name}, ${args.value}`)
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

  await simpleDagsExecutor(taskNode)

  expect(results).toEqual([
    'task, Charlie',
    'task, Charlie',
    'task, Charlie',
    'task, Charlie',
    'task, Charlie',
    'task, Charlie',
    'task2, Bob, 42',
    'task2, Bob, 42',
    'task, Alice',
  ])
})
