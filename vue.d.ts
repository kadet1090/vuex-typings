import { VuexStore } from "vuex";
import { Vue } from "vue/types/vue";
import { DefaultComputed, DefaultData, DefaultMethods, DefaultProps, PropsDefinition } from "vue/types/options";

declare module "vue/types/vue" {
    interface Vue {
        $store?: VuexStore<any>;
    }
}

declare module "vue/types/options" {
    interface ComponentOptions<
        V extends Vue,
        Data = DefaultData<V>,
        Methods = DefaultMethods<V>,
        Computed = DefaultComputed,
        PropsDef = PropsDefinition<DefaultProps>,
        Props = DefaultProps
    > {
        store?: VuexStore<any>;
    }
}
