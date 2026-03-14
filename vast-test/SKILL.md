---
name: vast-test
version: 0.1.0
description: "提供两个明确能力：计算两个数之和；回显文本"
author: vast-skills
license: MIT

capabilities:
  - id: add-two-numbers
    description: "计算两个数字之和并返回结果数值"
  - id: echo-text
    description: "回显输入文本并返回文本长度与原文"

permissions:
  network: false
  filesystem: false
  shell: false
  clipboard: false
  env: []

inputs:
  - name: a
    type: number
    required: false
    description: "第一个数字（用于加法）"
  - name: b
    type: number
    required: false
    description: "第二个数字（用于加法）"
  - name: text
    type: string
    required: false
    description: "需要回显的文本"
  - name: op
    type: string
    required: false
    default: "auto"
    description: "操作：add-two-numbers 或 echo-text；省略时自动推断"

outputs:
  - name: result
    type: number
    description: "加法结果"
  - name: message
    type: string
    description: "回显文本"
  - name: length
    type: number
    description: "文本长度"

tags:
  - testing
  - demo
  - math
  - text

minOpenClawVersion: "2.1.0"
---
