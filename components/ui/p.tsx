import React from "react"

type Props = {
    children: string | string[] | React.ReactNode,
    className?: string,
}

export function TypographyP(props: Props) {
    return (
      <p className={`leading-7 ${props.className}`}>
        {props.children}
      </p>
    )
  }
  