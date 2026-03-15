import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CLI = join(__dirname, "vendor", "xiaohongshu-skills", "scripts", "cli.py");

function runCli(sub, args, globals) {
  return new Promise((resolve, reject) => {
    const argv = [];
    if (globals?.host) argv.push("--host", String(globals.host));
    if (globals?.port) argv.push("--port", String(globals.port));
    if (globals?.account) argv.push("--account", String(globals.account));
    const ps = spawn("python3", [CLI, ...argv, sub, ...args], { cwd: __dirname });
    let out = "";
    let err = "";
    ps.stdout.on("data", (d) => (out += d.toString()));
    ps.stderr.on("data", (d) => (err += d.toString()));
    ps.on("close", (code) => {
      if (!out.trim() && err.trim()) return reject(new Error(err.trim()));
      try {
        const json = out.trim() ? JSON.parse(out) : {};
        resolve({ code, data: json, stderr: err });
      } catch {
        resolve({ code, data: { raw: out }, stderr: err });
      }
    });
    ps.on("error", reject);
  });
}

function pick(v, def) {
  return typeof v === "undefined" || v === null ? def : v;
}

function resolveCommand(inputs) {
  if (inputs?.command) return String(inputs.command);
  if (inputs?.keyword) return "xhs-search-feeds";
  if (inputs?.feedId && inputs?.xsecToken) return "xhs-get-feed-detail";
  if (inputs?.userId && inputs?.xsecToken) return "xhs-user-profile";
  if (inputs?.content && inputs?.feedId && inputs?.xsecToken && inputs?.commentTarget === "reply") return "xhs-reply-comment";
  if (inputs?.content && inputs?.feedId && inputs?.xsecToken) return "xhs-post-comment";
  if (typeof inputs?.unlike !== "undefined") return "xhs-like-feed";
  if (typeof inputs?.unfavorite !== "undefined") return "xhs-favorite-feed";
  if (inputs?.titleFile && inputs?.contentFile && inputs?.images?.length) return "xhs-publish";
  if (inputs?.titleFile && inputs?.contentFile && inputs?.video) return "xhs-publish-video";
  if (inputs?.phone && inputs?.code) return "xhs-phone-login";
  if (inputs?.phone) return "xhs-send-code";
  if (inputs?.code) return "xhs-verify-code";
  return "xhs-check-login";
}

function buildArgs(cmd, i) {
  switch (cmd) {
    case "xhs-check-login":
      return ["check-login"];
    case "xhs-login":
      return ["login"];
    case "xhs-get-qrcode":
      return ["get-qrcode"];
    case "xhs-wait-login":
      return ["wait-login", "--timeout", String(pick(i?.timeout, 120))];
    case "xhs-phone-login":
      return ["phone-login", "--phone", String(i?.phone), "--code", String(pick(i?.code, ""))];
    case "xhs-send-code":
      return ["send-code", "--phone", String(i?.phone)];
    case "xhs-verify-code":
      return ["verify-code", "--code", String(i?.code)];
    case "xhs-delete-cookies":
      return ["delete-cookies"];
    case "xhs-list-feeds":
      return ["list-feeds"];
    case "xhs-search-feeds":
      return [
        "search-feeds",
        "--keyword",
        String(i?.keyword),
        ...(i?.sortBy ? ["--sort-by", String(i.sortBy)] : []),
        ...(i?.noteType ? ["--note-type", String(i.noteType)] : []),
        ...(i?.publishTime ? ["--publish-time", String(i.publishTime)] : []),
        ...(i?.searchScope ? ["--search-scope", String(i.searchScope)] : []),
        ...(i?.location ? ["--location", String(i.location)] : []),
      ];
    case "xhs-get-feed-detail":
      return [
        "get-feed-detail",
        "--feed-id",
        String(i?.feedId),
        "--xsec-token",
        String(i?.xsecToken),
        ...(i?.loadAllComments ? ["--load-all-comments"] : []),
        ...(i?.clickMoreReplies ? ["--click-more-replies"] : []),
        "--max-replies-threshold",
        String(pick(i?.maxRepliesThreshold, 10)),
        "--max-comment-items",
        String(pick(i?.maxCommentItems, 0)),
        "--scroll-speed",
        String(pick(i?.scrollSpeed, "normal")),
      ];
    case "xhs-user-profile":
      return ["user-profile", "--user-id", String(i?.userId), "--xsec-token", String(i?.xsecToken)];
    case "xhs-post-comment":
      return ["post-comment", "--feed-id", String(i?.feedId), "--xsec-token", String(i?.xsecToken), "--content", String(i?.content)];
    case "xhs-reply-comment":
      return [
        "reply-comment",
        "--feed-id",
        String(i?.feedId),
        "--xsec-token",
        String(i?.xsecToken),
        "--content",
        String(i?.content),
        ...(i?.commentId ? ["--comment-id", String(i.commentId)] : []),
        ...(i?.userId ? ["--user-id", String(i.userId)] : []),
      ];
    case "xhs-like-feed":
      return [
        "like-feed",
        "--feed-id",
        String(i?.feedId),
        "--xsec-token",
        String(i?.xsecToken),
        ...(i?.unlike ? ["--unlike"] : []),
      ];
    case "xhs-favorite-feed":
      return [
        "favorite-feed",
        "--feed-id",
        String(i?.feedId),
        "--xsec-token",
        String(i?.xsecToken),
        ...(i?.unfavorite ? ["--unfavorite"] : []),
      ];
    case "xhs-publish":
      return [
        "publish",
        "--title-file",
        String(i?.titleFile),
        "--content-file",
        String(i?.contentFile),
        ...(Array.isArray(i?.images) && i.images.length ? ["--images", ...i.images.map(String)] : []),
        ...(Array.isArray(i?.tags) && i.tags.length ? ["--tags", ...i.tags.map(String)] : []),
        ...(i?.scheduleAt ? ["--schedule-at", String(i.scheduleAt)] : []),
        ...(i?.original ? ["--original"] : []),
        ...(i?.visibility ? ["--visibility", String(i.visibility)] : []),
        ...(i?.headless ? ["--headless"] : []),
      ];
    case "xhs-fill-publish":
      return [
        "fill-publish",
        "--title-file",
        String(i?.titleFile),
        "--content-file",
        String(i?.contentFile),
        ...(Array.isArray(i?.images) && i.images.length ? ["--images", ...i.images.map(String)] : []),
        ...(Array.isArray(i?.tags) && i.tags.length ? ["--tags", ...i.tags.map(String)] : []),
        ...(i?.scheduleAt ? ["--schedule-at", String(i.scheduleAt)] : []),
        ...(i?.original ? ["--original"] : []),
        ...(i?.visibility ? ["--visibility", String(i.visibility)] : []),
      ];
    case "xhs-publish-video":
      return [
        "publish-video",
        "--title-file",
        String(i?.titleFile),
        "--content-file",
        String(i?.contentFile),
        "--video",
        String(i?.video),
        ...(Array.isArray(i?.tags) && i.tags.length ? ["--tags", ...i.tags.map(String)] : []),
        ...(i?.scheduleAt ? ["--schedule-at", String(i.scheduleAt)] : []),
        ...(i?.visibility ? ["--visibility", String(i.visibility)] : []),
        ...(i?.headless ? ["--headless"] : []),
      ];
    case "xhs-fill-publish-video":
      return [
        "fill-publish-video",
        "--title-file",
        String(i?.titleFile),
        "--content-file",
        String(i?.contentFile),
        "--video",
        String(i?.video),
        ...(Array.isArray(i?.tags) && i.tags.length ? ["--tags", ...i.tags.map(String)] : []),
        ...(i?.scheduleAt ? ["--schedule-at", String(i.scheduleAt)] : []),
        ...(i?.visibility ? ["--visibility", String(i.visibility)] : []),
      ];
    case "xhs-click-publish":
      return ["click-publish"];
    case "xhs-save-draft":
      return ["save-draft"];
    case "xhs-long-article":
      return [
        "long-article",
        "--title-file",
        String(i?.titleFile),
        "--content-file",
        String(i?.contentFile),
        ...(Array.isArray(i?.images) && i.images.length ? ["--images", ...i.images.map(String)] : []),
      ];
    case "xhs-select-template":
      return ["select-template", "--name", String(i?.templateName)];
    case "xhs-next-step":
      return ["next-step", "--content-file", String(i?.descriptionFile)];
    case "xhs-add-account":
      return ["add-account", "--name", String(i?.name), ...(i?.description ? ["--description", String(i.description)] : [])];
    case "xhs-list-accounts":
      return ["list-accounts"];
    case "xhs-remove-account":
      return ["remove-account", "--name", String(i?.name)];
    case "xhs-set-default-account":
      return ["set-default-account", "--name", String(i?.name)];
    default:
      return ["check-login"];
  }
}

export async function execute(inputs, context) {
  const cmd = resolveCommand(inputs);
  const args = buildArgs(cmd, inputs);
  const globals = {
    host: pick(inputs?.host, "127.0.0.1"),
    port: pick(inputs?.port, 9222),
    account: inputs?.account ? String(inputs.account) : undefined,
  };
  const res = await runCli(args[0], args.slice(1), globals);
  return { data: res.data, status: res.code === 0 ? "ok" : "nonzero" };
}
