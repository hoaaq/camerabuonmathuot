<template>
  <client-only>
    <v-layout id="map-wrap" style="height: 100vh">
      <v-layout style="position: absolute; top: 0; right: 0; z-index: 1000">
        <v-container fluid>
          <v-btn small light fab @click="drawer = !drawer">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-container>
        <v-navigation-drawer
          v-model="drawer"
          class="pa-3"
          right
          fixed
          width="40%"
        >
          <v-btn small light fab @click="drawer = !drawer">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <div v-for="(cam, i) in camSelect" :key="cam" class="mt-5">
            {{ cam }}
            <br />
            Status:
            <span v-if="camStatus[listcam.indexOf(cam)] === 'Online'">
              <v-icon size="25" :color="statusIconOnline.color">
                {{ statusIconOnline.icon }}
              </v-icon>
              {{ camStatus[listcam.indexOf(cam)] }}
            </span>
            <span v-else>
              <v-icon size="25" :color="statusIconOffline.color">
                {{ statusIconOffline.icon }}
              </v-icon>
              {{ camStatus[listcam.indexOf(cam)] }}
            </span>
            <v-hover class="mt-3">
              <template>
                <div
                  class="d-flex flex-column align-center"
                  style="position: relative; height: 375px"
                >
                  <canvas
                    :id="'canvas' + cam.id"
                    class="liveviewcanvas"
                  ></canvas>
                  <div class="liveviewinfo">
                    <span>{{ cam.code }}</span>
                  </div>
                  <v-fade-transition>
                    <v-overlay absolute>
                      <v-btn icon color="info" @click="handlePlayCam(cam)"
                        ><v-icon size="35">mdi-play</v-icon></v-btn
                      >
                      <v-btn icon color="white" @click="openPlayBack(cam)"
                        ><v-icon>mdi-film</v-icon></v-btn
                      >
                      <v-btn icon size="50" color="error" @click="removeCam(i)"
                        ><v-icon>mdi-close</v-icon></v-btn
                      >
                    </v-overlay>
                  </v-fade-transition>
                </div>
              </template>
            </v-hover>
          </div>
        </v-navigation-drawer>
      </v-layout>
      <l-map :zoom="15" :center="[10.7377, 106.7188]">
        <l-tile-layer
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        ></l-tile-layer>
        <l-layer-group v-for="(l, idx) in latLong" :key="l">
          <l-marker
            v-if="idxSelect.includes(idx) && idxSelect.length !== 0"
            :lat-lng="l"
            @click="selectCam(idx)"
          >
            <l-icon :icon-size="iConSize" :icon-url="camURL.select"> </l-icon>
          </l-marker>
          <l-marker
            v-else-if="camStatus[idx] === 'Online'"
            :lat-lng="l"
            @click="selectCam(idx)"
          >
            <l-icon :icon-size="iConSize" :icon-url="camURL.online"> </l-icon>
          </l-marker>
          <l-marker v-else :lat-lng="l" @click="selectCam(idx)">
            <l-icon :icon-size="iConSize" :icon-url="camURL.offline"> </l-icon>
          </l-marker>
        </l-layer-group>
      </l-map>
    </v-layout>
  </client-only>
</template>

<script src="./index.js"></script>
