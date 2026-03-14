export async function execute(inputs, context) {
  const op = inputs?.op ?? 'auto';
  const hasNumbers = typeof inputs?.a !== 'undefined' && typeof inputs?.b !== 'undefined';
  if (op === 'add-two-numbers' || (op === 'auto' && hasNumbers)) {
    const a = Number(inputs?.a);
    const b = Number(inputs?.b);
    if (Number.isNaN(a) || Number.isNaN(b)) {
      throw new Error('a 与 b 必须是数字');
    }
    return { result: a + b };
  }
  if (op === 'echo-text' || (op === 'auto' && typeof inputs?.text === 'string')) {
    const text = inputs?.text ?? '';
    return { message: text, length: text.length };
  }
  throw new Error('未识别的操作，请提供 op=add-two-numbers 或 op=echo-text，或提供对应输入');
}
