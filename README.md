# DigitalHippo

## dependencies

- yarn create next-app --typescript
- yarn add lucid-react
- npx shadcn-ui@latest init
- npx shadcn-ui@latest add button
- npx shadcn-ui@latest add sheet
- npx shadcn-ui@latest add separator
- yarn add express
- yarn add dotenv
- yarn add payload

## express Admin dashboard

- add server.ts to /app directory and get-payload.ts
  - can get path from 'path'

## draw template

- excalidraw.com

## prettify currency

- /lib/utils formatPrice

## identifying when you click out of a section

- use a useRef<HTMLDivElement | null>
- can add ref prop to div

## Event listener

- These two things are the same
  - document.addEventListener("keydown", handler)
  - document.addEventListener("keydown", (e) => handler(e))
- avoid memory leaks
  - return () => document.removeEventListener("keydown", handler)

## shadcn

- Select theme from website and copy css style in global.css
- Can add buttonVariants() className to Link component to apply button style from styles we chose at the beginning
  - className={buttonVariants({ variant: "ghost" })}
- asChild disables components like SheetTrigger from trying to wrap all child elements as a button

## lucide icons

- ludice.dev has list of icons
- Can add Icons component which ...props and can let you load in unique SVG's by defining their name

## generics

- useState<null | number> defines it can be null or a number

## tailwind

- making something absolute and then inset-x-0 makes left and right 0px which makes it effectively stretch full
- sometimes parent div orients the content, next layer styles the shadow
- flow-root
  - puts element in unique block

## typescript

- define type example in NavItem.tsx

## images

- add object-cover and object-center

## navbar

- because parent is relative, child drop is down is absolute and since parent has defined height as well, we can say top-full on the children component and have it pushed directly under the navbar section

## notes

- MaxWidthWrapper creates custom wrapper to contain content
