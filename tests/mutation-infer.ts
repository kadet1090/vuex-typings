import { VuexGettersTree, VuexMutationHandler } from "../types"
import { Validate } from "../types/helpers"

type State = { foo: string }

const mutations = {
  added(state: State, payload: string) {
    state.foo = payload
  }
}

type MutationInferenceTest = Validate<
  VuexGettersTree<State>,
  typeof mutations
>

type MutationHandlerInferenceTest = Validate<
  VuexMutationHandler<State, string>,
  typeof mutations["added"]
>