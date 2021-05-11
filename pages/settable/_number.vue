<template>
  <div>
    <Header />
    <v-container>
      <div class="box-center">
        <div>
          <div class="d-flex align-center">
            <h2 class="mr-2">M</h2>
            <v-text-field
            class="field"
            type="number"
            reverse
            v-model="men"
            name="men"
            solo
            height="60"
            ></v-text-field>
            <div class="ml-2">
              <v-btn 
              class="mb-2"
              @click="countUp('men')"><v-icon>mdi-arrow-up</v-icon></v-btn><br>
              <v-btn 
              @click="countDown('men')"><v-icon>mdi-arrow-down</v-icon></v-btn>
            </div>
          </div>
          <div class="d-flex align-center">
            <h2 class="mr-2">W</h2>
            <v-text-field
            class="field"
            type="number"
            reverse
            v-model="women"
            name="women"
            solo
            height="60"
            ></v-text-field>
            <div class="ml-2">
              <v-btn 
              class="mb-2"
              @click="countUp('women')"><v-icon>mdi-arrow-up</v-icon></v-btn><br>
              <v-btn 
              @click="countDown('women')"><v-icon>mdi-arrow-down</v-icon></v-btn>
            </div>
          </div>
          <div class="d-flex align-center">
            <h2 class="mr-2">C</h2>
            <v-text-field
            class="field"
            type="number"
            reverse
            v-model="children"
            name="children"
            solo
            height="60"
            ></v-text-field>
            <div class="ml-2">
              <v-btn 
              class="mb-2"
              @click="countUp('children')"><v-icon>mdi-arrow-up</v-icon></v-btn><br>
              <v-btn 
              @click="countDown('children')"><v-icon>mdi-arrow-down</v-icon></v-btn>
            </div>
          </div>
          <div class="d-flex align-center">
            <h2 class="mr-2">O</h2>
            <v-text-field
            class="field"
            type="number"
            reverse
            v-model="others"
            name="others"
            solo
            height="60"
            ></v-text-field>
            <div class="ml-2">
              <v-btn 
              class="mb-2"
              @click="countUp('others')"><v-icon>mdi-arrow-up</v-icon></v-btn><br>
              <v-btn 
              @click="countDown('others')"><v-icon>mdi-arrow-down</v-icon></v-btn>
            </div>
          </div>
          <div class="btn-center">
            <v-btn
            x-large
            dark
            @click="createTable()">OK</v-btn>
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import SteinStore from 'stein-js-client'
import Header from '../../components/Header.vue'

const store = new SteinStore(process.env.API_URL)

export default {
  components: { Header },
  data() {
    return {
      tableNumber: this.$route.params.number,
      men: 0,
      women: 0,
      children: 0,
      others: 0
    }
  },
  methods: {
    countUp(args) {
      if (args == 'men') {
        return this.men++;
      } else if (args == 'women') {
        return this.women++;
      } else if (args == 'children') {
        return this.children++;
      } else {
        return this.others++;
      }
    },
    countDown(args) {
      if (args == 'men') {
        return this.men > 0 ? this.men--:false;
      } else if (args == 'women') {
        return this.women > 0 ? this.women--:false;
      } else if (args == 'children') {
        return this.children > 0 ? this.children--:false;
      } else {
        return this.others > 0 ? this.others--:false;
      }
    },
    createTable() {
      const d = new Date();
      const now = this.$getNow(d);
      store.read("tables", { search: {name: this.tableNumber} }).then(data => {
        const nextNumber = Number(data[0].current_number) + 1;
        let id = this.$zeroPadding(nextNumber, 10)
        store.append("results", [
          {
            id: id,
            table: this.tableNumber,
            created_at: now,
            updated_at: now,
            men: this.men,
            women: this.women,
            children: this.children,
            others: this.others,
            stat: '1'
          }
        ]).then(res => {
          console.log(res);
          store.edit("tables" , {
            search: {name: this.tableNumber},
            set: {stat: 1, current_number: nextNumber, updated_at: now}
          }).then(res => {
            console.log(res);
            this.$router.push({path: `/order/${this.tableNumber}/${id}`});
          }).catch(error => {
            console.log(error);
          });
        }).catch(error => {
          console.log(error);
        });
      })
    }
  }
}
</script>

<style lang="scss">
h2 {
  font-size: 2rem;
  width: 30%;
  height: auto;
  border-radius: 50%;
  text-align: center;
  color: white;
  background-color: #000;
}
.v-input__slot {
  font-size: 2rem;
  margin: 0 auto;
}
.field {
  padding-top: 20px !important;
}
.btn-center {
  display: flex;
  justify-content: center;
}
.box-center {
  position: fixed;
  top: 50%;
  //left: 0;
  transform: translate(0, -50%);
  padding: 0 5%;
}
</style>