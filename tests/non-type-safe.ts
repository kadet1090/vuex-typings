import { VuexActionTypes, VuexMutationTypes } from "../types";
import { Validate } from "../types/helpers";

type ActionTypesOfAnyShouldBeString = Validate<VuexActionTypes<any>, string>
type MutationTypesOfAnyShouldBeString = Validate<VuexMutationTypes<any>, string>



