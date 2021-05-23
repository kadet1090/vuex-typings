import { VuexGetters } from "./getters";
import { VuexModule } from "./modules";
import { VuexCommit } from "./mutations";
import { VuexState } from "./state";
import { VuexStore, VuexStoreDefinition } from "./store";

export type VuexActionsTree 
  = { [name: string]: VuexActionHandler<any, any, any, any>; }

export type VuexActionHandler<
  TModule extends VuexModule, 
  TPayload = never, 
  TResult = Promise<void>,
  TDefinition extends VuexStoreDefinition = any,
> = (
  this: VuexStore<TDefinition>, 
  context: VuexActionContext<TModule, TDefinition>, 
  payload: TPayload
) => TResult

export type VuexActionContext<
  TModule extends VuexModule, 
  TRoot extends VuexModule<any, any, any, any, any> = VuexModule<any, any, any, any, any>
> = {
    commit: VuexCommit<TModule>,
    state: VuexState<TModule>,
    getters: VuexGetters<TModule>,
    rootState: VuexState<TRoot>,
    rootGetters: VuexGetters<TRoot>,
  }