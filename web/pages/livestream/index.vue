<template>
  <div class="fill-height">
    <div class="d-flex fill-height">
      <!-- <div class="leftsidebar">
        <v-btn outlined small @click="drawer = !drawer">Tùy chọn</v-btn>
        <draggable
          v-model="selectedcam"
          tag="ul"
          class="list-group"
          group="selectedcam"
        >
          <transition-group type="transition" name="flip-list">
            <li
              v-for="element in selectedcam"
              :key="element.code"
              class="list-group-item"
            >
              {{ element.code }}
            </li>
          </transition-group>
        </draggable>
      </div> -->
      <v-container fluid>
        <div class="topbar">
          <v-select
            v-model="windowsinrow"
            :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]"
            label="Số cột"
            dense
            hide-details
            class="flex-grow-0 mx-3"
          ></v-select>
          <v-btn outlined small @click="drawer = !drawer">Tùy chọn</v-btn>
        </div>
        <div class="d-flex flex-wrap liveview-contain">
          <div
            v-for="(cam, i) in selectedcam"
            :key="i"
            class="liveview-loop"
            :style="`width: ${windowwidth}%`"
          >
            <v-hover>
              <template v-slot:default="{ hover }">
                <div
                  class="d-flex flex-column align-center liveview-box"
                  style="position: relative"
                >
                  <canvas
                    :id="'canvas' + cam.id"
                    class="liveviewcanvas"
                  ></canvas>
                  <div class="liveviewinfo">
                    <span>{{ cam.name }}</span>
                  </div>
                  <v-fade-transition>
                    <v-overlay v-if="hover" absolute>
                      <v-btn icon color="info" @click="handlePlay(cam)"
                        ><v-icon>mdi-play</v-icon></v-btn
                      >
                      <v-btn icon color="white" @click="handleStop(cam)"
                        ><v-icon>mdi-stop</v-icon></v-btn
                      >
                      <v-btn icon color="error" @click="handleRemove(cam)"
                        ><v-icon>mdi-close</v-icon></v-btn
                      >
                    </v-overlay>
                  </v-fade-transition>
                </div>
              </template>
            </v-hover>
          </div>
        </div>
        <!-- <v-row>
          <v-col v-for="(cam, i) in selectedcam" :key="i" cols="3">
            <v-hover>
              <template v-slot:default="{ hover }">
                <div
                  class="d-flex flex-column align-center"
                  style="position: relative"
                >
                  <canvas
                    :id="'canvas' + cam.id"
                    class="liveviewcanvas"
                  ></canvas>
                  <div class="liveviewinfo">
                    <span>{{ cam.code }}</span>
                  </div>
                  <v-fade-transition>
                    <v-overlay v-if="hover" absolute>
                      <v-btn icon color="info" @click="handlePlay(cam)"
                        ><v-icon>mdi-play</v-icon></v-btn
                      >
                      <v-btn icon color="white" @click="handleStop(cam)"
                        ><v-icon>mdi-stop</v-icon></v-btn
                      >
                      <v-btn icon color="error" @click="handleRemove(cam)"
                        ><v-icon>mdi-close</v-icon></v-btn
                      >
                    </v-overlay>
                  </v-fade-transition>
                </div>
              </template>
            </v-hover>
          </v-col>
        </v-row> -->
      </v-container>
    </div>

    <v-navigation-drawer
      v-model="drawer"
      class="pa-3"
      right
      fixed
      temporary
      width="70%"
    >
      <div>
        <v-text-field
          v-model="searchString"
          label="Tìm kiếm"
          @input="searchString.length < 5 ? throttlesearch() : debouncesearch()"
        ></v-text-field>
      </div>
      <v-overlay :value="searchOverlay" absolute>
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-overlay>
      <v-list two-line>
        <v-list-item
          v-for="(item, i) in listcam"
          :key="i"
          @click="handleSelectcam(item)"
        >
          <v-list-item-content>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.fulltext }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script src="./index.js"></script>
<style lang="scss" scoped src="./index.scss"></style>
