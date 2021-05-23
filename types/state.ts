import { VuexModule } from "./modules";

export type VuexOwnState<TModule extends VuexModule<any, any, any, any>> 
    = TModule["state"];

export type VuexState<TModule extends VuexModule<any, any, any, any>>
    = VuexOwnState<TModule>
    & { [TSubModule in keyof TModule["modules"]]: VuexState<TModule["modules"][TSubModule]> }
    ;