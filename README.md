# DigitalHippo

## dependencies

- yarn create next-app --typescript
- yarn add lucid-react
- npx shadcn-ui@latest init
- npx shadcn-ui@latest add button
- npx shadcn-ui@latest add sheet
- npx shadcn-ui@latest add separator
- npx shadcn-ui@latest add input
- npx shadcn-ui@latest add label
- yarn add express
- yarn add dotenv
- yarn add payload
- yarn add cross-env
- yarn add @payloadcms/richtext-slate @payloadcms/bundler-webpack @payloadcms/db-mongodb
  - can also choose lexigal
- yarn add react-hook-form @hookform/resolvers zod sonner
- yarn add @trpc/client @trpc/next @trpc/react-query @trpc/server @tanstack/react-query

## trpc

- typescript for frontend and backend

## Sign up

- Use a form
- use focus-visible:ring-red-500 for error state
  - className={cn({"focus-visible:ring-red-500": errors.email,})}
- useForm abstracts away the need to but id's on each element and to track each element's changes
  - pass into resolver a z.object schema and put the type of TAuthCredentialsValidator with z.infer into useForm<> for true type safety for functions like 'register' which you get back from useForm()
- pass in {...register("password")} or {...register("email")} as props to Input component and that's all you need to do
- <form onSubmit={handleSubmit(onSubmit)}>

## Auth

- we will capture token from email that is sent to /verify-email with ?token=<token>

## Mongodb

- connect with drivers since we are using node.js

## self host

- checkout server.ts to see an example of how to make next.js more flexible for things like websockets which vercel doesn't normally support
- change in package.json dev command from this to this
  - "dev": "next dev",
  - 'dev': "cross-env PAYLOAD_CONFIG_PATH=app/payload.config.ts nodemon"

## payload CMS

- in /app/payload.config.ts
- add nodemon.json in root directory
- add tsconfig.server.json to root directory as well
- payload.config.ts allows us to define the route (in this case /sell)

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
