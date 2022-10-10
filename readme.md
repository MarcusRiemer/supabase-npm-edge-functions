# Reproduction steps

## Compile `npm-lib`

1. `(cd npm-lib && npm install && npx tsc --project tsconfig.json)`
2. There should now be a compiled version of the library at `npm-lib/dist`

## Install dependencies and copy `npm-lib` in `functions` folder

1. `(cd server/supabase/functions && npm install)`
2. `(cd server/supabase/functions && npm run build)`
3. There should now be a `node_modules` folder and a `npm-lib` folder at `server/supabase/functions`.

## Verify running works with "vanilla" deno

1. `(cd server && deno run --allow-read --allow-env supabase/functions/core-data.ts)`
2. Should output something along the lines of `Hello from core data { CORE_DATA: { foo: [ 1, 2, 3 ] }, update: [Function: update] }`

## Works: Start supabase, serve the function and edit the function
1. Install Supabase 1.7.0: `(cd server && npm install)`
2. `(cd server && npx supabase start)`
3. `(cd server && npx supabase functions serve hello-npm --debug)`
4. The function should now be available, you may test it using `curl -i --location --request POST 'http://localhost:54321/functions/v1/' --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' --header 'Content-Type: application/json' --data '{"name":"Functions"}'`
5. Uncomment lines marked with `// ### Uncomment after boot` in `server/supabase/functions/hello-npm/index.ts`
6. The function will automatically be reloaded, the output should read:
  ```
  Hello from core data { CORE_DATA: { foo: [ 1, 2, 3 ] }, update: [Function: update] }
  Hello from Functions, core data is  { foo: [ 1, 2, 3 ] }
  ```
7. If you re-execute the above `curl`-command, you will see that the invocation now returns `{"foo":"Functions"}`. Therefore `immer.js` has been loaded just fine and is working as intended.

## Broken: Restart the function

1. Stop the previous `functions serve` instance.
2. Start it again: `(cd server && npx supabase functions serve hello-npm --debug)`
3. This will fail with loads of errors along the lines of the following:
  ```
  TS2339 [ERROR]: Property 'loadavg' does not exist on type 'typeof Deno'. 'Deno.loadavg' is an unstable API. Did you forget to run with the '--unstable' flag?
    return Deno.loadavg();
                ~~~~~~~
      at https://deno.land/std@0.112.0/node/os.ts:171:15

  TS2339 [ERROR]: Property 'osRelease' does not exist on type 'typeof Deno'. 'Deno.osRelease' is an unstable API. Did you forget to run with the '--unstable' flag?
    return Deno.osRelease();
                ~~~~~~~~~
      at https://deno.land/std@0.112.0/node/os.ts:185:15

  TS2339 [ERROR]: Property 'systemMemoryInfo' does not exist on type 'typeof Deno'. 'Deno.systemMemoryInfo' is an unstable API. Did you forget to run with the '--unstable' flag?
    return Deno.systemMemoryInfo().total;
                ~~~~~~~~~~~~~~~~
      at https://deno.land/std@0.112.0/node/os.ts:231:15
  ```

## Broken: Deploy