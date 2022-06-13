import { ref, Ref } from 'vue'
import router from '@/router'
import { useRoute } from 'vue-router'
import type AdminNav from '@/types/AdminNav.type'

const currNav = ref(0)
const navigation = ref([]) as Ref<AdminNav[]>
const navItem = ref('')
const navName = ref('')

function setInitialNavigation(name: string, nav: AdminNav[], ni: string) {
    navigation.value = nav
    navItem.value = ni
    navName.value = name
    const route = useRoute()

    const navAvailable = nav.findIndex((x) => {
        return route.params.navSubItem === x.slug
    })

    setCurrNav(navAvailable >= 0 ? navAvailable : 0)
}

function setCurrNav(index: number) {
    currNav.value = index
    router.push({
        name: navName.value,
        params: {
            navItem: navItem.value,
            navSubItem: navigation.value[index].slug,
        },
    })
}

export function setNavigation() {
    return {
        currNav: currNav,
        setInitialNavigation,
        setCurrNav,
    }
}

export default setNavigation
