import { expectType } from "ts-expect"
import {
  createStore,
  GlobalVuexModule,
  NamespacedVuexModule,
  VuexActionHandler,
  VuexActionPayload,
  VuexActionResult,
  VuexGetter,
  VuexMutationHandler,
  VuexMutationPayload,
  VuexStoreDefinition,
  mapState,
  VuexMapStateHelper,
  mapGetters,
  VuexMapGettersHelper,
  mapMutations, 
  VuexMapMutationsHelper,
  mapActions, 
  VuexMapActionsHelper 
} from "../types"
import { Validate } from "../types/helpers"

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
  [FooMutations.Added]: VuexMutationHandler<FooState, string, MyStore>
  [FooMutations.Removed]: VuexMutationHandler<FooState, number, MyStore>
}

type FooActionsTree = {
  [FooActions.Refresh]: VuexActionHandler<FooModule, never, Promise<void>, MyStore>,
  [FooActions.Load]: VuexActionHandler<FooModule, string[], Promise<string[]>, MyStore>,
}

type FooGettersTree = {
  first: VuexGetter<FooModule, string>
  firstCapitalized: VuexGetter<FooModule, string>,
  rooted: VuexGetter<FooModule, string, MyStore>
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

type MyStore = Validate<VuexStoreDefinition, {
  state: {
    global: string;
  },
  modules: {
    bar: BarModule,
    foo: FooModule,
    anotherFoo: FooModule,
  },
  getters: {
    globalGetter: VuexGetter<MyStore, string>
  }
}>

// test
let store = createStore<MyStore>({} as any)

// global state
expectType<string>(store.state.global);

// from global module
expectType<string>(store.state.bar.result);

// state of namespaced modules
expectType<string[]>(store.state.foo.list)
expectType<string[]>(store.state.anotherFoo.list)

// state of nested modules
expectType<number>(store.state.foo.sub.current)
expectType<number>(store.state.anotherFoo.sub.current)

// should check and auto complete
store.commit("foo/added", "test");
store.commit({ type: "foo/added", payload: "test" });

store.commit("anotherFoo/added", "test");
store.commit({ type: "anotherFoo/added", payload: "test" });

store.commit("foo/sub/inc", 10);
store.commit({ type: "foo/sub/dec", payload: 10 });

store.commit(BarMutations.Fizz, 10);
store.commit({ type: BarMutations.Fizz, payload: 10 });
store.commit(BarMutations.Buzz);
store.commit({ type: BarMutations.Buzz });

// @ts-expect-error
store.commit("foo/added", 9);
// @ts-expect-error
store.commit("foo/added");

// dispatch works too!
store.dispatch("anotherFoo/load", ["test"]);
store.dispatch({ type: "anotherFoo/load", payload: ["test"] });

// @ts-expect-error
store.dispatch("anotherFoo/load", 0);
// @ts-expect-error
store.dispatch("foo/load");

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
expectType<string>(store.getters['foo/first']);
expectType<string>(store.getters['anotherFoo/first']);
expectType<string>(store.getters['foo/firstCapitalized']);
expectType<string>(store.getters['globalGetter'])
expectType<string>(store.getters['foo/rooted'])
expectType<any>(store.getters['non-existent']);

// watch state is properly typed
store.watch(state => state.global, (value, oldValue) => value.toLowerCase() !== oldValue.toLowerCase())

// watch getters too!
store.watch((_, getters) => getters['foo/first'], (value, oldValue) => value.toLowerCase() !== oldValue.toLowerCase())

store.subscribe(mutation => {
  // properly detects payload type based on mutation kind
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
  firstCapitalized: (_, getters, rootState, rootGetters) => getters.first.toUpperCase(), // getters too!
  rooted: (_, __, rootState, rootGetters) => rootState.global + rootGetters.globalGetter, // and global state!
}

let fooActions: FooActionsTree = {
  async load(context, payload): Promise<string[]> {
    // context is bound to this module
    // and payload is properly typed!
    context.commit(FooMutations.Added, payload[0]);

    // also works for actions
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

const helpers = { 
  mapState: mapState as VuexMapStateHelper<MyStore>,
  mapGetters: mapGetters as VuexMapGettersHelper<MyStore>,
  mapMutations: mapMutations as any as VuexMapMutationsHelper<MyStore>,
  mapActions: mapActions as any as VuexMapActionsHelper<MyStore>,
}

const state = helpers.mapState({ 
  mappedGlobal: "global",
  mappedByFunction: state => state.foo.list
});

expectType<() => string>(state.mappedGlobal)
expectType<() => string[]>(state.mappedByFunction)

const getters = helpers.mapGetters({ 
  mappedFooFirst: "foo/first"
});

expectType<() => string>(getters.mappedFooFirst)

const mutations = helpers.mapMutations({ 
  mappedFooAdded: "foo/added",
  mappedBuzz: BarMutations.Buzz,
  mappedFizz: BarMutations.Fizz
})

mutations.mappedFooAdded("string")
mutations.mappedFizz(10)
// @ts-expect-error
mutations.mappedFizz("string") // wrong argument type
// @ts-expect-error
mutations.mappedFizz() // no argument
mutations.mappedBuzz()

const actions = helpers.mapActions({
  mappedFooLoad: "foo/load",
  mappedFooRefresh: "foo/refresh",
})

actions.mappedFooLoad(["string", "string2"])
actions.mappedFooRefresh()