<template>
  <div>
    <v-container fluid>
      <TopTitle :title="title" />
      <v-sheet elevation="2">
        <v-row>
          <v-col cols="12" md="5">
            <v-treeview
              item-children="childs"
              item-key="id"
              item-text="ten"
              :items="[recursivelist]"
              activatable
              return-object
              @update:active="selectLocation"
            >
              <template v-slot:label="{ item }">
                <span v-if="item.camera.length > 0" style="cursor: pointer">
                  {{ item.ten }}&nbsp;
                  <span class="badge accent white--text"
                    >( {{ item.camera.length }} camera )</span
                  >
                </span>
                <span v-else style="cursor: pointer">{{ item.ten }}</span>
              </template>
            </v-treeview>
          </v-col>
          <v-col cols="12" md="7">
            <div class="sticky">
              <v-card v-if="selecteditem.ten" light>
                <v-card-title>{{ selecteditem.ten }}</v-card-title>
                <v-card-text>
                  <v-list two-line>
                    <div
                      v-for="(item, i) in selecteditem.camera"
                      :key="i"
                      class="d-flex align-center"
                    >
                      <v-list-item @click="editcam(item)">
                        <v-list-item-content>
                          <v-list-item-title>{{ item.name }}</v-list-item-title>
                          <v-list-item-subtitle
                            >Channel {{ item.channel }}</v-list-item-subtitle
                          >
                        </v-list-item-content>
                      </v-list-item>
                      <v-btn icon @click="del(item)">
                        <v-icon color="error">mdi-close</v-icon>
                      </v-btn>
                    </div>
                  </v-list>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="info" text @click="upload"
                    >Thêm bằng file</v-btn
                  >
                  <v-btn color="primary" text @click="addcam">Thêm mới</v-btn>
                  <v-btn text @click="addbydvr">Thêm bằng đầu thu</v-btn>
                </v-card-actions>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-sheet>
    </v-container>

    <v-dialog v-model="dialog" max-width="70vw" light>
      <v-card>
        <v-card-title>
          <span class="headline accent--text">{{ modalTitle }}</span>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-container>
            <ValidationObserver ref="observer">
              <v-row>
                <v-col cols="12">
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="code"
                    rules="required"
                  >
                    <v-text-field
                      v-model="modalItem.code"
                      label="Tên định danh camera"
                      dense
                      clearable
                      persistent-hint
                      :error-messages="errors"
                    >
                    </v-text-field>
                  </ValidationProvider>
                </v-col>
                <v-col cols="12">
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="link"
                    rules="required"
                  >
                    <v-text-field
                      v-model="modalItem.link"
                      label="URL camera"
                      dense
                      clearable
                      persistent-hint
                      :error-messages="errors"
                    >
                    </v-text-field>
                  </ValidationProvider>
                </v-col>
              </v-row>
            </ValidationObserver>
          </v-container>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="accent" text @click="dialog = false">Trở về</v-btn>
          <v-btn color="success" text @click="saveChange">Lưu thay đổi</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogFile" max-width="70vw" light>
      <v-card>
        <v-card-title>
          <span class="headline accent--text">Thêm mới bằng file</span>
          <a class="ml-5" href="filecamera.xlsx" download>File mẫu</a>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-container>
            <ValidationObserver ref="observerFile">
              <v-row>
                <v-col cols="12">
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="fileUpload"
                    rules="required"
                  >
                    <v-file-input
                      v-model="fileUpload"
                      label="File camera"
                      dense
                      clearable
                      persistent-hint
                      :error-messages="errors"
                      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    >
                    </v-file-input>
                  </ValidationProvider>
                </v-col>
              </v-row>
            </ValidationObserver>
          </v-container>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="accent" text @click="dialogFile = false">Trở về</v-btn>
          <v-btn color="success" text @click="submitFile">Tải lên</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDvr" max-width="70vw" light>
      <v-card>
        <v-card-title>
          <span class="headline accent--text">Thêm mới bằng đầu thu</span>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-container>
            <ValidationObserver ref="observerDvr">
              <v-row>
                <v-col cols="12">
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="dvrlink"
                    rules="required"
                  >
                    <v-text-field
                      v-model="dvr.link"
                      label="URL đầu thu"
                      dense
                      clearable
                      persistent-hint
                      :error-messages="errors"
                    >
                    </v-text-field>
                  </ValidationProvider>
                </v-col>
                <v-col>
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="username"
                    rules="required"
                  >
                    <v-text-field
                      v-model="dvr.username"
                      label="Username"
                      dense
                      clearable
                      persistent-hint
                      :error-messages="errors"
                    >
                    </v-text-field>
                  </ValidationProvider>
                </v-col>
                <v-col>
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="Password"
                    rules="required"
                  >
                    <v-text-field
                      v-model="dvr.password"
                      label="Password"
                      dense
                      clearable
                      persistent-hint
                      type="password"
                      :error-messages="errors"
                    >
                    </v-text-field>
                  </ValidationProvider>
                </v-col>
              </v-row>
            </ValidationObserver>
          </v-container>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="accent" text @click="dialogDvr = false">Trở về</v-btn>
          <v-btn color="success" text @click="submitDvr">Lấy camera</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirmDvr" max-width="70vw" light>
      <v-card>
        <v-card-title>
          <span class="headline accent--text"
            >Xác nhận thêm các camera sau?</span
          >
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <table>
                  <tbody>
                    <tr v-for="(item, i) in listfromdvr" :key="i">
                      <td class="px-3">Channel {{ item.channel }}:</td>
                      <td class="px-3">{{ item.name }}</td>
                    </tr>
                  </tbody>
                </table>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="accent" text @click="dialogConfirmDvr = false"
            >Trở về</v-btn
          >
          <v-btn color="success" text @click="confirmDvr">Lấy camera</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script src="./index.js"></script>
<style lang="scss" scoped src="./index.scss"></style>
