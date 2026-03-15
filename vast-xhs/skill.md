---
name: xhs-suite
version: 0.1.0
description: "小红书自动化全能技能：登录、检索、详情、互动、发布与账号管理"
author: vast-skills
license: MIT

capabilities:
  - id: xhs-check-login
    description: "检查登录状态，必要时返回二维码信息"
  - id: xhs-login
    description: "扫码登录（阻塞等待）"
  - id: xhs-get-qrcode
    description: "获取登录二维码（非阻塞）"
  - id: xhs-wait-login
    description: "等待扫码完成（配合二维码登录）"
  - id: xhs-phone-login
    description: "手机号+验证码登录（交互式或传入 code）"
  - id: xhs-send-code
    description: "分步登录：发送短信验证码"
  - id: xhs-verify-code
    description: "分步登录：提交短信验证码完成登录"
  - id: xhs-delete-cookies
    description: "退出并删除 cookies 文件"
  - id: xhs-list-feeds
    description: "获取首页 Feeds 列表"
  - id: xhs-search-feeds
    description: "搜索 Feeds（关键词、筛选、排序）"
  - id: xhs-get-feed-detail
    description: "获取 Feed 详情，支持评论加载与展开"
  - id: xhs-user-profile
    description: "获取用户主页信息"
  - id: xhs-post-comment
    description: "发表评论"
  - id: xhs-reply-comment
    description: "回复评论"
  - id: xhs-like-feed
    description: "点赞或取消点赞"
  - id: xhs-favorite-feed
    description: "收藏或取消收藏"
  - id: xhs-publish
    description: "发布图文内容"
  - id: xhs-publish-video
    description: "发布视频内容"
  - id: xhs-fill-publish
    description: "填写图文表单，不发布"
  - id: xhs-fill-publish-video
    description: "填写视频表单，不发布"
  - id: xhs-click-publish
    description: "点击发布按钮"
  - id: xhs-save-draft
    description: "保存草稿"
  - id: xhs-long-article
    description: "长文模式：填写内容并生成模板列表"
  - id: xhs-select-template
    description: "选择长文排版模板"
  - id: xhs-next-step
    description: "长文模式下一步并填写发布页描述"
  - id: xhs-add-account
    description: "添加命名账号"
  - id: xhs-list-accounts
    description: "列出所有命名账号"
  - id: xhs-remove-account
    description: "删除命名账号"
  - id: xhs-set-default-account
    description: "设置默认账号"

permissions:
  network: true
  filesystem: true
  shell: true
  clipboard: false
  env: []

inputs:
  - name: command
    type: string
    required: false
    description: "命令别名（与 capability 对应），如 xhs-search-feeds"
  - name: account
    type: string
    required: false
    description: "命名账号"
  - name: host
    type: string
    required: false
    default: "127.0.0.1"
    description: "Chrome 调试主机"
  - name: port
    type: number
    required: false
    default: 9222
    description: "Chrome 调试端口"
  - name: phone
    type: string
    required: false
    description: "手机号"
  - name: code
    type: string
    required: false
    description: "短信验证码"
  - name: keyword
    type: string
    required: false
    description: "搜索关键词"
  - name: sortBy
    type: string
    required: false
    description: "排序"
  - name: noteType
    type: string
    required: false
    description: "类型"
  - name: publishTime
    type: string
    required: false
    description: "时间范围"
  - name: searchScope
    type: string
    required: false
    description: "范围"
  - name: location
    type: string
    required: false
    description: "位置"
  - name: feedId
    type: string
    required: false
    description: "Feed ID"
  - name: xsecToken
    type: string
    required: false
    description: "xsec_token"
  - name: loadAllComments
    type: boolean
    required: false
    default: false
    description: "加载全部评论"
  - name: clickMoreReplies
    type: boolean
    required: false
    default: false
    description: "展开更多回复"
  - name: maxRepliesThreshold
    type: number
    required: false
    default: 10
    description: "展开回复数阈值"
  - name: maxCommentItems
    type: number
    required: false
    default: 0
    description: "最大评论数"
  - name: scrollSpeed
    type: string
    required: false
    default: "normal"
    description: "滚动速度"
  - name: userId
    type: string
    required: false
    description: "用户 ID"
  - name: content
    type: string
    required: false
    description: "评论内容"
  - name: unlike
    type: boolean
    required: false
    default: false
    description: "取消点赞"
  - name: unfavorite
    type: boolean
    required: false
    default: false
    description: "取消收藏"
  - name: titleFile
    type: string
    required: false
    description: "标题文件路径"
  - name: contentFile
    type: string
    required: false
    description: "正文文件路径"
  - name: images
    type: array
    required: false
    description: "图片路径或 URL 列表"
  - name: tags
    type: array
    required: false
    description: "标签"
  - name: scheduleAt
    type: string
    required: false
    description: "定时发布时间（ISO8601）"
  - name: original
    type: boolean
    required: false
    default: false
    description: "声明原创"
  - name: visibility
    type: string
    required: false
    description: "可见范围"
  - name: video
    type: string
    required: false
    description: "视频文件路径"
  - name: templateName
    type: string
    required: false
    description: "长文模板名称"
  - name: descriptionFile
    type: string
    required: false
    description: "发布页描述文件"

outputs:
  - name: data
    type: object
    description: "底层 CLI 返回的 JSON 数据"
  - name: status
    type: string
    description: "状态信息"

tags:
  - xiaohongshu
  - automation
  - content
  - publish
  - search

minOpenClawVersion: "2.1.0"
---
