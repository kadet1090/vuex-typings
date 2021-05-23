import { GlobalVuexModule, NamespacedVuexModule } from "./modules"
import { VuexMutationHandler } from "./mutations"
import { createStore, VuexStore } from "./store"

// example store definition
type FooState = { list: string[] }
type BarState = { result: string }
type BazState = { current: number }

enum FooMutations {
  Added = "added",
  Removed = "removed",
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

type BarMutationTree = {
  [BarMutations.Fizz]: VuexMutationHandler<BarState, number>;
  [BarMutations.Buzz]: VuexMutationHandler<BarState>;
}

type BazMutationTree = {
  [BazMutations.Inc]: VuexMutationHandler<BazState, number>;
  [BazMutations.Dec]: VuexMutationHandler<BazState, number>;
}

type FooModule = NamespacedVuexModule<FooMutationTree, { sub: BazModule }>;
type BarModule = GlobalVuexModule<BarMutationTree, {}>;
type BazModule = NamespacedVuexModule<BazMutationTree, {}>;

type MyStore = {
  modules: {
    foo: FooModule,
    bar: BarModule,
    anotherFoo: FooModule,
  },
  mutations: {}
}

// test
let store = createStore<MyStore>({} as any)

store.commit("foo/added", "test"); 
store.commit({ type: "foo/added", payload: "test" }); 