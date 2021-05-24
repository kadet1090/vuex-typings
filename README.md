# Strong types for Vuex

This project is a Proof of Concept for creating strongly typed Vuex Stores by utilizing [template literal types] feature available in typescript. End goal is to reimplement all [vuex types] for better type-checking and autocompletion without external modules.

## Core idea
The core idea for this set of types can be simply described as `type first`. You should start designing your store from contract, and your store should implement this contract - not the other way around. As from this package point of view the store is just a vuex module with extra stuff, and I will use word `store` to refer to both store and module.

For example, simple counter store could be described as follows:

```typescript
type CounterState = { value: number }
enum CounterMutations { Increment = "increment", Decrement = "decrement" }

type CounterMutationsTree = {
  [CounterMutations.Increment]: VuexMutationHandler<CounterState, number>, // number is payload
  [CounterMutations.Decrement]: VuexMutationHandler<CounterState, number>,
}

// or you could write it like below, both syntaxes are equally valid
type CounterMutationsTree = {
  [CounterMutations.Increment](state: CounterState, payload: number): void,
  [CounterMutations.Decrement](state: CounterState, payload: number): void,
}

type CounterModule = VuexGlobalModule<CounterState, CounterMutationsTree>
// or
type CounterModule = {
  state: CounterState,
  mutations: CounterMutationsTree
}

export const counter: CounterModule = { 
  ... // will enforce proper types
}
```

## Can I use it in my project?
For now I concider this project as proof of concept that have to be further validated and polished as it have some quirks that makes this project unnecesarily cumbersome to use. I plan to release it however as separate package ASAP and maybe try to start some RFC process on merging something like that into Vuex core.

## Example
This example is taken from the [test.ts](./test.ts) file and could be interactively tested using vscode or other editor with decent support of typescript language server.

```typescript
// example store definition
type FooState = { list: string[] }
type BarState = { result: string }
type BazState = { current: number }

enum FooMutations {
  Added = "added",
  Removed = "removed",
}

enum FooActions {
  Refresh = "refresh",
  Load = "load",
}

enum BarMutations {
  Fizz = "fizz",
  Buzz = "buzz",
}

enum BazMutations {
  Inc = "inc",
  Dec = "dec",
}

type FooMutationTree = {
  [FooMutations.Added]: VuexMutationHandler<FooState, string>
  [FooMutations.Removed]: VuexMutationHandler<FooState, number>
}

type FooActionsTree = {
  [FooActions.Refresh]: VuexActionHandler<FooModule, never, Promise<void>, MyStore>,
  [FooActions.Load]: VuexActionHandler<FooModule, string[], Promise<string[]>, MyStore>,
}

type FooGettersTree = {
  first: VuexGetter<FooModule, string>
  firstCapitalized: VuexGetter<FooModule, string>,
}

type BarMutationTree = {
  [BarMutations.Fizz]: VuexMutationHandler<BarState, number>;
  [BarMutations.Buzz]: VuexMutationHandler<BarState>;
}

type BazMutationTree = {
  [BazMutations.Inc]: VuexMutationHandler<BazState, number>;
  [BazMutations.Dec]: VuexMutationHandler<BazState, number>;
}

type FooModule = NamespacedVuexModule<FooState, FooMutationTree, FooActionsTree, FooGettersTree, { sub: BazModule }>;
type BarModule = GlobalVuexModule<BarState, BarMutationTree>;
type BazModule = NamespacedVuexModule<BazState, BazMutationTree>;

type MyStore = {
  state: {
    global: string;
  },
  modules: {
    foo: FooModule,
    bar: BarModule,
    anotherFoo: FooModule,
  },
  mutations: {},
  getters: {},
  actions: {},
}

let store = createStore<MyStore>({} as any)

// should check and auto complete
store.commit("foo/added", "test");
store.commit({ type: "foo/added", payload: "test" });

// dispatch works too!
store.dispatch("anotherFoo/load", ["test"]);
store.dispatch({ type: "anotherFoo/load", payload: ["test"] });

// should check correctly
store.replaceState({
  global: "test",
  foo: {
    list: [],
    sub: {
      current: 0
    }
  },
  anotherFoo: {
    list: [],
    sub: {
      current: 0
    }
  },
  bar: {
    result: "fizzbuzz"
  }
})

// getters also work
store.getters['anotherFoo/first'];

// watch state is properly typed
store.watch(state => state.global, (value, oldValue) => value.toLowerCase() !== oldValue.toLowerCase())

// watch getters too!
store.watch((_, getters) => getters['foo/first'], (value, oldValue) => value.toLowerCase() !== oldValue.toLowerCase())

store.subscribe(mutation => {
  // properly detects payload type based on mutaiton kind
  if (mutation.type === "anotherFoo/sub/dec") {
    const number = mutation.payload; // typeof number = number
  } else if (mutation.type === "anotherFoo/added") {
    const str = mutation.payload; // typeof str = string
  }
})

store.subscribeAction((action, state) => {
  // properly detects payload type based on action kind
  if (action.type === "anotherFoo/load") {
    const arr = action.payload; // typeof arr = string[]
  }

  // state is also correctly represented
  const foo = state.foo.list;
})

// 
store.subscribeAction({
  after(action, state) { /* ... */ },
  before(action, state) { /* ... */ },
  error(action, state, error) { /* ... */ }
})

// getters with backreference
let fooGetters: FooGettersTree = {
  first: state => state.list[0], // state is correctly typed
  firstCapitalized: (_, getters) => getters.first.toUpperCase(), // getters too!
}

let fooActions: FooActionsTree = {
  async load(context, payload): Promise<string[]> {
    // context is bound to this module
    // and payload is properly typed!
    context.commit(FooMutations.Added, payload[0]);

    context.dispatch(FooActions.Load, payload);
    context.dispatch(FooActions.Refresh);

    const list = context.state.list;

    // we can however access root state
    const bar = context.rootState.bar; // typeof bar = BarState;

    // ... and getters
    const first = context.rootGetters['anotherFoo/first'];

    return [];
  },
  async refresh(context) {
    // simple actions to not require return type!
  }
}

// utility types
type PayloadOfFooAddedMutation = VuexMutationPayload<MyStore, "foo/added">; // string

type PayloadOfFooLoadAction = VuexActionPayload<MyStore, "foo/load">; // string[]
type ResultOfFooLoadAction = VuexActionResult<MyStore, "foo/load">; // string[]
```

## Progress
 - [x] Modules 
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
     - [x] Mutation handler type `VuexMutationHandler<TState, TPayload = never, TStore = never>`
       - [x] Properly type `this` in handler (store backref)
     - [x] Commit types
       - [x] Payload `VuexMutationPayload<TModule, TMutation>`
       - [x] Argument-Style `VuexCommit<TModule>`
       - [x] Object-Style `VuexMutations<TModule>`
       - [x] Commit options `VuexCommitOptions`
         - [ ] Support `{ root: true }`
   - [x] Actions `TActions extends VuexActionsTree`
     - [x] Non-type-safe fallback `VuexActionsTree` ??
     - [x] Available actions `VuexActions<TModule>`
       - [x] Own `VuexOwnActions<TModule>`
       - [x] From submodules
         - [x] Global 
         - [x] Namespaced
     - [x] Action handler `VuexActionHandler<TModule, TPayload = never, TResult = Promise<void>>`
       - [x] Action Context `VuexActionContext<TModule, TStoreDefinition = any>` 
       - [x] Properly type `this` in handler (store backref)
     - [x] Dispatch type `VuexDispatch<TModule>`
       - [x] Payload `VuexActionPayload<TModule, TAction>`
       - [x] Result `VuexActionResult<TModule, TAction>`
       - [x] Argument-Style
       - [x] Object-Style `VuexAction<TModule>`
       - [x] Dispatch Options `VuexDispatchOptions`
         - [ ] Support `{ root: true }`
   - [x] Getters `TGetters extends VuexGettersTree`
     - [x] Non-type-safe fallback `VuexGettersTree` ??
     - [x] Available getters `VuexGetters<TModule>`
       - [x] Own `VuexOwnGetters<TModule>`
       - [x] From submodules
         - [x] Global 
         - [x] Namespaced
     - [x] Getter type `VuexGetter<TModule, TResult>`
       - [x] Support for beckreferencing getters
     - [x] Result `VuexGetterResult<TModule, TGetter>`
   - [x] Submodules `TModules extends VuexModulesTree`
 - [x] Store Definition `VuexStoreDefinition<TState, TMutations = {}, TActions = {}, TModules = {}, TGetters = {}>`
   - Basically `VuexGlobalModule` with additional things
   - [x] Plugins `VuexPlugin<TStoreDefinition>`
   - [x] Simple properties (`devtools`, etc.)
 - [ ] Store instance `VuexStore<TStoreDefinition>`
   - [x] Constructor
     - [x] Store Options `VuexStoreDefinition`
   - [x] State (as defined by TStoreDefinition)
     - [x] Replace state `replaceState` 
   - [x] Getters (as defined by TStoreDefinition)
   - [x] Commit (as defined by TStoreDefinition)
   - [x] Dispatch (as defined by TStoreDefinition)
   - [x] Subscribers
     - [x] Options `VuexSubscribeOptions` 
     - [x] Actions `subscribeAction`
       - [x] Subscriber `VuexActionSubscriber<TDefinition>`
         - [x] Callback `VuexActionSubscriberCallback<TDefinition>`
         - [x] ErrorCallback `VuexActionErrorSubscriberCallback<TDefinition>`
         - [x] Object `VuexActionSubscribersObject<TDefinition>`
     - [x] Mutations `subscribe`
       - [x] Subscriber `VuexMutationSubscriber<TDefinition>`
   - [x] Watch `watch`
     - [x] ~~Options `WatchOptions`~~ should be imported from Vue
   - [ ] Dynamic module management
     - [ ] Registration `registerModule`
     - [ ] Unregistration `unregisterModule`
     - [ ] Presence check `hasModule`
   - [x] Hot Update - it's not type safe so it's declared loosely

## License
MIT

[template literal types]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#template-literal-types
[vuex types]: https://github.com/vuejs/vuex/blob/4.0/types/index.d.ts