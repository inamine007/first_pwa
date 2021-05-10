<template>
 <v-simple-table>
   <template v-slot:default>
     <thead>
       <tr>
         <th class="text-center">Name</th>
         <th class="text-center">Price</th>
       </tr>
     </thead>
     <tbody>
       <tr v-for="item in items" :key="item.id">
         <td class="text-center">{{ item.name }}</td>
         <td class="text-center">{{ item.price }} yen</td>
       </tr>
     </tbody>
   </template>
 </v-simple-table>
</template>

<script>
export default {
 props: {
   items: {
     default: () => [],
     type: Array
   }
 }
}
</script>