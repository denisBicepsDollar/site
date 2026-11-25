export function leavingTagProps(props: Record<string, unknown>): {
  className: string | undefined;
} & Record<string, unknown> {
  const kept: Record<string, unknown> = {};
  for (const [name, value] of Object.entries(props))
    if (name.startsWith("data-")) kept[name] = value;
  return {
    ...kept,
    className:
      typeof props.className === "string" ? props.className : undefined,
  };
}
