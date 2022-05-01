<template>
  <div :class="findRules.length === 0 ? 'orange lighten-3' : ''">
    <h1>State {{ depth }} ({{ path.join(' &#x2192; ') }})</h1>
    <v-container  class="pa-0 ma-0" fluid>
      <v-row>
        <v-col :cols="undefined">
          <v-expansion-panels  v-model="panel" v-if="findRules.length > 1" flat hover>
            <v-expansion-panel
                v-for="(rule,i) in findRules"
                :key="i"
            >
              <v-expansion-panel-header :class="panel === i ? 'light-blue lighten-3' : ''"  class="ml-2">
                <h3>({{ getRuleIndex(rule) +1}}) {{ rule.left.join("") + " &#x2192; " + rule.right.join("") }} </h3>
                <v-subheader>{{rule.comment}}</v-subheader>
              </v-expansion-panel-header>
              <v-expansion-panel-content id="innerExPan" >
                <rule-finder :state="findApplications(rule)" :path="getNewPath(rule)" :depth="depth + 1" />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-list v-else-if="findRules.length === 1">
            <v-list-item class="light-blue lighten-5 ml-2"> <h3>({{ getRuleIndex(findRules[0]) + 1}}) {{ findRules[0].left.join("") + " &#x2192; " + findRules[0].right.join("") }}</h3></v-list-item>
            <rule-finder :state="findApplications(findRules[0])" :path="getNewPath(findRules[0])" :depth="depth + 1"/>
          </v-list>
          <div v-else class="ml-2">
            <h3>Endstatus.</h3>
          </div>
        </v-col>
        <v-col v-show="(panel === -1 || panel == null) && findRules.length !== 1" :cols="3">
          <div :id="'table-structure'+path.toString()" class="table-structure"></div>
        </v-col>
      </v-row>
    </v-container>
  </div>

</template>

<script>
import rules from "@/rules";
import prettyprint from "@/prettyprint";
import _ from "lodash";
export default {
  name: "ruleFinder",
  props: {
    state: {
      type: Array,
      required: true
    },
    path: {
      type: Array,
      required: true
    },
    depth: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    panel: -1
  }),
  computed: {
    findRules() {
      return rules
          .filter(rule => this.state.toString().indexOf(rule.left) !== -1);
    },
    prettyState() {
      let newDiv = document.createElement("div");
      let lastShift = 0;
      this.state.forEach(st => {
        let result = prettyprint(st, lastShift);
        newDiv.appendChild(result.element);
        lastShift = result.lastShift;
      } )

      return newDiv
    }
  },
  mounted() {
    let el = document.getElementById("table-structure"+this.path.toString());
    el.appendChild(this.prettyState);//this.state.toString().replaceAll(/,/g, "");
  },
  methods: {
    findApplications(rule) {
      return this.state.toString().replace(new RegExp(rule.left), rule.right ).split(",");
    },
    getRuleIndex(cmpRule) {
      return rules.findIndex(rule => rule.left.toString() === cmpRule.left.toString() &&
          rule.right.toString() === cmpRule.right.toString());
    },
    getNewPath(cmpRule) {
      let copyPath = _.clone(this.path);
      copyPath.push(this.getRuleIndex(cmpRule) + 1);
      return copyPath;
    }
  }
}
</script>

<style scoped>
.v-expansion-panel-content>>> .v-expansion-panel-content__wrap {
  padding: 0 !important;
}
</style>