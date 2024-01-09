import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function YamHover() {
    return (
      <HoverCard>
        <HoverCardTrigger asChild className="items-center">
          <div style={{ marginTop: '-21.5px' }}>
              <Button variant="link" className="font-mono text-sm m-2 p-0">[Yam]🍠</Button>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="">
            <p className="font-mono text-sm">Yam is a bespoke mailroom management and data platform. Contact <strong>sales@useyam.com</strong> for more information or 
            visit <Link href="https://useyam.com" className="underline hover:cursor-pointer hover:italic">useyam.com</Link></p>
          </div>
        </HoverCardContent>
      </HoverCard>
    )
  }