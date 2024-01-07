import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

import { Button } from "@/components/ui/button"
import { CalendarDays } from "lucide-react"
import { TypographyP } from "./ui/p"

export function YamHover() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild className="items-center">
        <div style={{ marginTop: '-21.5px' }}>
            <Button variant="link" className="font-mono text-sm m-2 p-0">[Yam]🍠</Button>
        </div>
        {/* <TypographyP className="font-mono text-sm items-center">Yam</TypographyP> */}
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          {/* <Avatar>
            <AvatarImage src="https://github.com/vercel.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@nextjs</h4>
            <p className="text-sm">
              The React Framework – created and maintained by @vercel.
            </p>
            <div className="flex items-center pt-2">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                Joined December 2021
              </span>
            </div>
          </div> */}
          <p className="font-mono text-sm">Yam is a bespoke mailroom management and data platform. Contact <strong>sales@useyam.com</strong> for more information.</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
