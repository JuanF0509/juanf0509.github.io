<!-- <script setup>
import { ref } from 'vue'

const count = ref('0')

const alertusky = () => {
  alert('En base de datos hay: ' + count.value + ' Bananas')
}

</script> -->

# Banana

<div id="desc1">Probando descripcion Banana</div>

<!-- 
<button :class="$style.button" @click="count++">Incrementa una banana</button>

<button @click="alertusky()">Numero de bananas en base de datos</button> -->

Numero de bananas en pantalla: {{ count }}
<button class="bg-red-600 border-2 border-red-400 rounded-md py-10 px-2 font-bold shadow-md shadow-red-200">Suscribete -></button>

<style module>
.button {
  color: red;
  font-weight: bold;
}
</style>

## Banana

VitePress provides Syntax Highlighting powered by [Shiki](https://github.com/shikijs/shiki), with additional features like line-highlighting:

**Input**

````
```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```
````

**Output**

```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```

## Custom Containers

**Input**

```md
::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::
```

**Output**

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::

## More

Check out the documentation for the [full list of markdown extensions](https://vitepress.dev/guide/markdown).
