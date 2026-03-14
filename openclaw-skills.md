你是一个openclaw的skills开发专家
每一个skills的使用一个目录存储在 项目根目录下
每一个skills使用的资源，如文件、代码等，全部存储在skills自己的目录下
skills的编写规则必须参照 项目根目录下的 openclaw-skills.md中的要求
这些skill的开发是为openclaw使用的，不是为trae使用的，需要全部上传到代码库中

# OpenClaw Skills 开发规则（参照指南）

本文依据通行实践总结 OpenClaw Skill 的目录规范、SKILL.md 写法与最小示例，便于在团队内快速落地。

## 一、Skill 是什么

- Skill 是一个可复用的自动化能力单元，以目录形式组织。
- 标准目录结构：

```
my-skill/
├── SKILL.md
├── scripts/
│   └── main.py
├── references/
│   └── api-docs.md
└── templates/
    └── email.html
```

## 二、初始化目录

```bash
mkdir -p my-skill/{scripts,references,templates}
cd my-skill
touch SKILL.md scripts/main.py
```

## 三、SKILL.md 编写规范

- 结构：YAML 前置区 + Markdown 正文
- YAML 前置字段（必填）
  - name：技能唯一名（kebab-case）
  - version：语义化版本（MAJOR.MINOR.PATCH）
  - description/author/license：基础元信息
  - capabilities：能力清单（每项含 id 与 description，描述具体、可触发）
  - permissions：最小权限（network/filesystem/shell/clipboard 布尔；env 为白名单）
  - inputs：参数定义（name、type、required、default、description）
  - outputs：输出定义（name、type、description）
  - tags：检索标签
  - minOpenClawVersion：最低兼容版本
- 可选字段（按需启用）
  - requiresUserConfirmation：高影响动作（如发送消息）设为 true
  - schedule：定时执行配置（如 interval/cron + capability）
  - events：事件定义（id、payload 字段）
- Markdown 正文建议
  - 使用说明与示例
  - 注意事项与限制
  - 依赖与安装方式

最小 YAML 示例：

```yaml
---
name: sample-skill
version: 0.1.0
description: "返回问候语的示例技能"
author: your-username
license: MIT

capabilities:
  - id: say-hello
    description: "返回一个简单问候"

permissions:
  network: false
  filesystem: false
  shell: false
  clipboard: false
  env: []

inputs:
  - name: name
    type: string
    required: false
    default: "World"
    description: "可选称呼"

outputs:
  - name: message
    type: string
    description: "问候语"

tags: [sample]
minOpenClawVersion: "2.1.0"
---
```

## 四、最小脚本示例

```python
#!/usr/bin/env python3
import argparse, json, requests

def get_weather(city: str, days: int = 1) -> dict:
    geo = requests.get(f"https://geocoding-api.open-meteo.com/v1/search?name={city}").json()
    if not geo.get("results"):
        return {"error": f"找不到城市：{city}"}
    lat = geo["results"][0]["latitude"]; lon = geo["results"][0]["longitude"]
    url = (
        "https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,weather_code"
        f"&timezone=auto&forecast_days={days}"
    )
    data = requests.get(url).json()
    current = data["current"]
    result = {
        "city": city,
        "temperature": current["temperature_2m"],
        "humidity": current["relative_humidity_2m"]
    }
    return result

def main():
    p = argparse.ArgumentParser()
    p.add_argument("city")
    p.add_argument("--days", type=int, default=1)
    p.add_argument("--format", choices=["text","json"], default="text")
    a = p.parse_args()
    w = get_weather(a.city, a.days)
    if a.format == "json":
        print(json.dumps(w, ensure_ascii=False, indent=2))
    else:
        if "error" in w:
            print(w["error"])
        else:
            print(f"{w['city']} {w['temperature']}°C 湿度{w['humidity']}%")

if __name__ == "__main__":
    main()
```

## 五、测试与验证

```bash
python scripts/main.py 北京
python scripts/main.py 上海 --days 3 --format json
```

## 六、规则与注意事项

- 文档先行：SKILL.md 内容完整、清晰、可复现
- 参数表完整：包含类型、必填与默认值
- 输出结构化：优先 JSON，便于集成
- 依赖可安装：提供一条命令即可安装完成
- 安全与合规：不输出密钥，下载与调用来源清晰
