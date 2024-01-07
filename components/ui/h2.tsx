type Props = {
    children: string | string[],
    className?: string,
}

export function TypographyH2(props: Props) {
    return (
      <h2 className={`scroll-m-20 pb-2 font-semibold tracking-tight first:mt-0 ${props.className}`}>
        {props.children}
      </h2>
    )
  }
  