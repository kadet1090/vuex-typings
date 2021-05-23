import { GlobalVuexModule, VuexModulesTree } from "./modules";
import { VuexMutationsTree } from "./mutations";

export type VuexStoreDefinition<
  TMutations extends VuexMutationsTree, 
  TModules extends VuexModulesTree
> = Omit<GlobalVuexModule<TMutations, TModules>, "namespaced">
  & {
    strict?: boolean,
    devtools?: boolean,
  }
  ;
