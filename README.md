# Strong types for Vuex

Proof of concept for usage of [template literal types] for vuex stores and modules. For now it supports nested (namespaced and not) modules and checking mutation `(name, payload)` pairs but for now allows only argument style commit function. 

## TODO
 - [ ] Modules 
   - [x] Global `VuexGlobalModule<TState, TMutations = {}, TActions = {}, TModules = {}, TGetters = {}>`
   - [x] Namespaced `VuexNamespacedModule<TState, TMutations = {}, TActions = {}, TModules = {}, TGetters = {}>`
   - [x] State `TState`
     - [x] State helper `VuexState<TModule>`
       - [x] Own `VuexOwnState<TModule>`
       - [x] From submodules
   - [x] Mutations `TMutations extends VuexMutationsTree`
     - [x] Non-type-safe fallback `VuexMutationsTree` ??
     - [x] Available mutations `VuexMutations<TModule>`
       - [x] Own `VuexOwnMutations<TModule>`
       - [x] From submodules
         - [x] Global 
         - [x] Namespaced
     - [x] Mutation handler type `VuexMutationHandler<TState, TPayload = never>`
       - [ ] Properly type `this` in handler (store backref)
     - [x] Commit types
       - [ ] ~~Payload `VuexMutationPayload<TModule, TMutation>`~~ Type is too deep
       - [x] Argument-Style `VuexCommit<TModule>`
       - [x] Object-Style `VuexMutations<TModule>`
       - [x] Commit options `VuexCommitOptions`
         - [ ] Support `{ root: true }`
   - [ ] Actions `TActions extends VuexActionsTree`
     - [x] Non-type-safe fallback `VuexActionsTree` ??
     - [ ] Available actions `VuexActions<TModule>`
       - [ ] Own `VuexOwnActions<TModule>`
       - [ ] From submodules
         - [ ] Global 
         - [ ] Namespaced
     - [ ] Action handler `VuexActionHandler<TState, TPayload = never, TResult = Promise<void>>`
       - [ ] Action Context `VuexActionContext<TModule, TStoreDefinition = any>` 
       - [ ] Properly type `this` in handler (store backref)
     - [ ] Dispatch type `VuexDispatch<TModule>`
       - [ ] Payload `VuexActionPayload<TModule, TAction>`
       - [ ] Result `VuexActionResult<TModule, TAction>`
       - [ ] Argument-Style
       - [ ] Object-Style `VuexAction<TModule>`
       - [ ] Dispatch Options `VuexDispatchOptions`
         - [ ] Support `{ root: true }`
   - [ ] Getters `TGetters extends VuexGettersTree`
     - [x] Non-type-safe fallback `VuexGettersTree` ??
     - [x] Available getters `VuexGetters<TModule>`
       - [x] Own `VuexOwnGetters<TModule>`
       - [x] From submodules
         - [x] Global 
         - [x] Namespaced
     - [x] Getter type `VuexGetter<TState, TResult>`
       - [ ] Support for beckreferencing getters
     - [x] Result `VuexGetterResult<TModule, TGetter>`
   - [x] Submodules `TModules extends VuexModulesTree`
 - [ ] Store Definition `VuexStoreDefinition<TState, TMutations = {}, TActions = {}, TModules = {}, TGetters = {}, TPlugins = {}>`
   - Basically `VuexGlobalModule` with additional things
   - [ ] Plugins `VuexPlugin<TStoreDefinition>`
   - [x] Simple properties (`devtools`, etc.)
 - [ ] Store instance `VuexStore<TStoreDefinition>`
   - [ ] Constructor
     - [ ] Store Options `VuexStoreOptions<TDefinition>`
   - [x] State (as defined by TStoreDefinition)
     - [x] Replace state `replaceState` 
   - [ ] Getters (as defined by TStoreDefinition)
   - [x] Commit (as defined by TStoreDefinition)
   - [ ] Dispatch (as defined by TStoreDefinition)
   - [ ] Subscribers
     - [ ] Options `SubscribeOptions` 
     - [ ] Actions `subscribeAction`
       - [ ] Subscriber `VuexActionSubscriber<TDefinition>`
         - [ ] Hook `VuexActionHook<?>`
         - [ ] Error `VuexActionError<?>`
         - [ ] Object `VuexActionSubscribersObject<TDefinition>`
     - [ ] Mutations `subscribe`
       - [ ] Subscriber `VuexMutationSubscriber<TDefinition>`
   - [ ] Watch `watch`
     - [ ] Options `WatchOptions`
   - [ ] Dynamic module management
     - [ ] Registration `registerModule`
     - [ ] Unregistration `unregisterModule`
     - [ ] Presence check `hasModule`
   - [ ] Hot Update ??



## Typescript Playground (Demo) [outdated]
[*click*](https://www.typescriptlang.org/play?#code/C4TwDgpgBAagrhAHgWQPYBM4BsIB4BQUUAKgHICGAthAM5jkDGE6USwEAdujVAEaqoc5DgBpCJZHGDlgAS1QcebTt1gIUUmfMXEAThAgio44mkw4lidlx7wkZ7LT0H8APigBeKAG9xRSppyCjQAXBKB2jQA3H5QlBiOoRIJFmJEAL5QAGRQABSxZFS09EwsyjZQwLoIsQD8PlAcRXSMzGFVCFCZsWHejc0lzLVhAGbkWDTQ6eIAlDH4oJBq9hEKABLC6Di6uMQAytLsRsQACuQgWKjkLF4cEABuELru4l4A2qfnl9cAuqxWKh4bzuj10f3E9VyNEOEDC+xhM087nuqFk6HEYShMLhBxkhig9AuV3QcLOROuiI8yNR6KI80W0DsGkOkWc0FeDViwKKYWhulkHAA5j8wkzJCz1pttrhhCAjLLXFFjBlxPTwIz1A4LGzlZ5OUQiNzqLyqgLhaLNSk8LL5Rw5VAFbrpnT8At1VAKNQWqUxVaCERTKtFP9rKoxUGaGyjCYtbQQ4DligrZH9BA3HrfeY8B18YGJYpjrGaK5Va6GVAAOKXXjjTOOf3hfOWUO2TURqO60zJ+MVOva1Pprx9vBjCa58VaYKF5Mll1upZMg6ofQAEQgIwFsiCHAbecnwfKYbbTY7Me7h9b9mTbMHUAA8pQt7gq6ga1hh7sJ9uaNOs8WjAARE0XqDOgAGztkPixHysgMMAwx8AIQiiLE6APMASE0LUPSIYIEDCGkXSlvO0AAKocNoxCoAAkhw7C6JMcHaLsLxEF4uTED2qiylAkKIHClLuDxYQgk8iIXnk-FQAKIxPFAABKgkOnaur1PJuoiQ8Txlu6ACC6DoCc+gboguwwOMnQSTBQrHEZ66yIgXE8NZgp6qJzy6u8pzGQ5fwScCWlgqpJDmVgnQYlAAAGAAk3jefZiDpAA9LFxChQg6SRcR5bhvmGxcNsZLfOgn5Bk5iZfto+VbE8Mp2raICuKxepnLoRT0TQpX5q4bwAIx+QCFRwFw9l3CwEKNIFGlQK17VPJ1e7bj1-XEUgYDLsA0l0U8YxMImADCqCUI+wB3mA35QUQNCyDgdEIfweHCDERC6AI8FhA9yExNMJEHUdJ1dfutlfMSzVeUVxIDS2UABaC4JEJCAT5nClUKEYhLFQhw1oRuY1GKg52RAhTKHcdW5nd+Skomi025Ej+4o0G6Mg9cpIs+g+OE8ExPqKTJ0U5EVM0tl7rDneADuHB81uC2xuVH42sp9oKrZPmOVZppCm5gVg1A5GUTR20MRATEKLgfRcot2hbVAADWEAgKgIzJFmbwAfT34AT8Ip-WTwANgaUD6YZau4C5kFW2jJB2SZriEYHuX7tVhXs5+Vpux7kRex8qMcD8EFEIq4jpG89uO87Xau+7EZe-nIsLpaWbS-7leOPLjf1orXd2nH0dq+V4e3DrnkVVaEtS-9Mtp1mqsJRBOQk5Pp0jEW0+OBnyZe7Psf1xqSDNwAQiAsZrxY7dXn+HbxSZA+a65Q+grrFuBx8ADSDs22XTsu4kPuxEQw5m4B0Dj-Cwb8HY-GjCAg0wcY4OVPrQcBIAoYJk9MUVo6AFb1SVu4SE4ccjEHfiAREmlQTbwcgXA0zVnRQDVA3feS87wr2TAg5sCZhwpgMOQ9Wg1VCD0mo-Ee+sFBUVoh1E225cCLz9kfE+rdUh9znqXB2395G0DrnOHK6glz6F2GuXGW5rYSUXBhVco1DFm27o1J+sQGBLwtBfRwQDiD6M3EtSCuQ6ZBgccyfcC1XEUSWpzb8PMGF+wFsEIWaIZjF13hVIMuw0G335DZaO7NtaCI5H0BkcIkndCIDkXIHwIa-HKrDJ4fx6h9EyL0Ak7M2bkhYOkGJv0mTj1zrLK058kxZjqsrbBKtFE3w1ik++AingQS8M-A0OcyoCjtioiusYM4129j43OwCiCwNDvgxsQMhkUPjgaRO25k5PBKSVNRKymzZ0jnnShEES5fyWenauNzvY6Xob478CDuknysQ1Xu18HLJLNBkiZHI2mSw6Qg7hEEAA++oZn7DgLwOW8znmgIgBvP8tcwj-3iU2TZBornu03j8D4exUWxkgbqaB2yEoIJxYkW5VK0VWhQRUNB3pmBYP6Y1XieRdkovZVmEh4zdBwoJdQ5R5csXMosLXOhe9vnaAubuOWxiO44D6Q1QFUC9nblBUKdMkLjx+IQe4LVKx8yA23EYGSclPiNOavUZ1xVpruWIklJK-wqBgBwFAaEy5oA4zcdoX6AAxAQuJ2B6j6FgWQ0ITSjLeH8aY5YD7kF0LG6AUyoD6BoNgYAKawUZvdFmgAXrm+NUAGBwF0PoOiIk4CUF4HJH6nBW1QGjagDpl0g4GWYHqAC1w0JgUIvJCA8RHg3CgABfQM7mAATEJ2jg3as26H7b4IgkbZCVsrSOjcB6V3iAPnAA9I7eAXsraetdG7yCVu3eIWiDAR0CgYKeoga431eAAmhT9q7PnQF7bnHUUzxBvFAxGAAdMHZgPsTlVSlLVXtuajAuQglBgQHSYNTqXegRD5rTkoZ2GhmERh11tohT9TN2awOpnjZBzduG90HqIzapOpHcCbvQ40Vt7bnjPRhix2D572PrKDGcnYvGYRF1oxWx9DGDBMcNFW3Dr6OOqslAVWqVa+NUcE0XNTSnYM-q07naTPHH0GYExM76wGe04a6V4bloEPzQfzB2PoRbeBhHU109IRc6Nbpc5WastZtV4FE151MRhvBBZiHRp9YW3MYI-OpoM3nEuOeQCAHReaB3xD-L0WIIwBBhFA1aI5NZdD+fo9V2IwhUDAAABZPF7ZV5zM9i6EUzsEXo0wfo+sqLQYAv1iBjYzNo0xeA8sFaLr9Nc16xlIYUOqgLM8oCZabDB19i2ANYGzdAEYw1TYcDrfoPEBW9HmKNdaxABWAkWJ3FYpquQw2BO0HCZ724Zg+Juy4u72hFs4E2sG-QeoGBXfYDd+bs3XC5ASw6HgsoWkQ4gDBuxftcgAXK6gJKY7l2AXYNCACcxjAY6x0vJHlR1RhDxwIQnQ6J11MaQz0nwAAJdAp0AA)
[template literal types]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#template-literal-types