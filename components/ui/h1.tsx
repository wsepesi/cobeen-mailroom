type Props = {
    children: string | string[],
    className?: string,
}

export function TypographyH1(props: Props) {
    return (
      <h1 className={`scroll-m-20 font-extrabold tracking-tight ${props.className}`}>
        {props.children}
      </h1>
    )
  }