<template>
  <v-row no-gutters class="pa-2">
    <v-col cols="12" lg="9">
      <v-container>
        <v-card loading="false" tile>
          <v-hover>
            <template>
              <div
                class="d-flex flex-column align-center"
                style="position: relative;"
              >
                <canvas class="liveviewcanvas"></canvas>
                <div class="liveviewinfo">
                  <span></span>
                </div>
                <!--                <v-fade-transition>-->
                <!--                  <v-overlay absolute>-->
                <!--                    <v-btn-->
                <!--                      v-if="this.selectedCam"-->
                <!--                      icon-->
                <!--                      color="info"-->
                <!--                      @click="handlePlayCam"-->
                <!--                      ><v-icon size="70">mdi-play</v-icon></v-btn-->
                <!--                    >-->
                <!--                  </v-overlay>-->
                <!--                </v-fade-transition>-->
              </div>
            </template>
          </v-hover>
        </v-card>
        <v-divider class="pa-3"></v-divider>
        <v-card>
          <v-row>
            <v-col
              cols="11"
              class="pl-10 mt-5"
              xs="8"
              sm="8"
              md="9"
              lg="9"
              xl="10"
            >
              <v-slider
                label="Giay"
                max="60"
                :value="parseInt(pickedSec)"
                @change="selectSec"
              >
              </v-slider>
            </v-col>
            <v-col
              cols="12"
              xs="4"
              sm="4"
              md="3"
              lg="3"
              xl="2"
              class="d-flex align-center justify-center"
            >
              <v-menu
                transition="slide-y-transition"
                top
                light
                min-width="60px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" text min-width="25px" v-on="on">
                    {{ pickedHour }}
                  </v-btn>
                </template>
                <v-list height="200" class="overflow-y-auto">
                  <v-list-item
                    v-for="(h, i) in hour"
                    :key="h"
                    @click="selectHour(i)"
                  >
                    <v-list-item-title>{{ h }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              :
              <v-menu
                transition="slide-y-transition"
                top
                light
                min-width="60px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" text min-width="25px" v-on="on">
                    {{ pickedMin }}
                  </v-btn>
                </template>
                <v-list height="200" class="overflow-y-auto">
                  <v-list-item v-for="m in min" :key="m" @click="selectMin(m)">
                    <v-list-item-title>{{ m }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              :
              <v-menu
                transition="slide-y-transition"
                top
                light
                min-width="60px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" text min-width="25px" v-on="on">
                    {{ pickedSec }}
                  </v-btn>
                </template>
                <v-list height="200" class="overflow-y-auto">
                  <v-list-item
                    v-for="s in second"
                    :key="s"
                    @click="selectSec(s)"
                  >
                    <v-list-item-title>{{ s }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </v-col>
    <v-col cols="12" lg="3">
      <v-container class="pa-0">
        <v-container>
          <v-card tile>
            <v-date-picker full-width @change="datetime"></v-date-picker>
          </v-card>
        </v-container>
        <v-container>
          <v-card tile>
            <v-card-title>Cam list</v-card-title>
            <div class="ml-3">
              <v-text-field
                v-model="searchString"
                label="Tìm kiếm"
                @input="
                  searchString.length < 5 ? throttlesearch() : debouncesearch()
                "
              ></v-text-field>
            </div>
            <v-overlay :value="searchOverlay" absolute>
              <v-progress-circular
                indeterminate
                color="primary"
              ></v-progress-circular>
            </v-overlay>
            <v-list two-line style="height: 338px" class="overflow-y-auto">
              <v-list-item
                v-for="(item, i) in listCam"
                :key="i"
                @click="handleSelectcam(item)"
              >
                <v-list-item-content @click="selectCam(item)">
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ item.fulltext }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-container>
      </v-container>
    </v-col>
  </v-row>
</template>
<script src="./index.js"></script>
<style lang="scss" scoped src="./index.scss"></style>
