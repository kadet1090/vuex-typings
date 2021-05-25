import { NamespacedVuexModule, VuexExtractState, VuexState, VuexStateProvider } from "../types"
import { Validate } from "../types/helpers"

type SubModule  = NamespacedVuexModule<{ inner: number }>
type RootModule = {
  state: VuexStateProvider<{ root: string }>,
  modules: {
    sub: SubModule
  }
}

type RootState = Validate<
  VuexState<RootModule>,
  { 
    root: string,
    sub: {
      inner: number
    }
  }
>

type State = { foo: string, bar: number }
type Extracted = Validate<
  State, 
  VuexExtractState<VuexStateProvider<State>>
>