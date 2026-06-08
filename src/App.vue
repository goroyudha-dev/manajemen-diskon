<template>
  <v-app class="bg-window">
    <v-main class="pa-8 d-flex justify-center">
      
      <div class="main-wrapper">
        
        <div class="text-left mb-6">
          <h1 class="font-weight-bold text-neutral-dark mb-4 font-inter" style="font-size: 26px; line-height: 1.2;">
            Daftar Diskon
          </h1>

          <v-menu transition="scale-transition">
            <template v-slot:activator="{ props }">
              <v-btn
                variant="outlined"
                color="grey-lighten-1"
                class="text-none pl-3 pr-4 py-5 rounded-lg text-neutral-dark bg-white dropdown-store shadow-sm"
                prepend-icon="mdi-store-outline"
                append-icon="mdi-chevron-down"
                elevation="0"
                v-bind="props"
              >
                <span class="font-weight-medium text-body-2 text-black ml-1">
                  {{ currentStore.name }}
                </span>
              </v-btn>
            </template>

            <v-list class="rounded-lg">
              <v-list-item 
                v-for="store in stores" 
                :key="store.id" 
                @click="switchStore(store)"
                :active="store.id === currentStore.id"
                color="#2bb673"
              >
                <v-list-item-title class="font-inter text-body-2">{{ store.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <v-card 
          v-if="discounts.length === 0" 
          class="content-card d-flex align-center justify-center text-center" 
          variant="outlined"
        >
          <v-card-text class="pa-12 d-flex flex-column align-center justify-center">
            <div class="illustration-container mb-8">
              <div class="coupon-bg-oval">
                <div class="coupon-half left-side"><v-icon icon="mdi-percent" size="36" color="#cca210"></v-icon></div>
                <div class="coupon-divider-line"></div>
                <div class="coupon-half right-side"><v-icon icon="mdi-label-percent" size="36" color="#cca210"></v-icon></div>
              </div>
            </div>
            <h2 class="text-h5 font-weight-bold text-neutral-dark mb-2 font-inter">Belum Ada Diskon</h2>
            <p class="text-body-1 text-neutral-medium max-width-text mb-6">
              Silahkan tambah diskon untuk menarik pelanggan di cabang <strong>{{ currentStore.name }}</strong>.
            </p>
            <v-btn color="#2bb673" size="large" class="rounded-pill px-8 text-none text-white font-weight-medium shadow-md" prepend-icon="mdi-plus" elevation="0" @click="openAddDialog">
              Tambah diskon
            </v-btn>
          </v-card-text>
        </v-card>

        <v-card v-else class="table-card" variant="outlined">
          <div class="d-flex flex-wrap justify-space-between align-center pa-4 gap-3 border-bottom-grey bg-table-header">
            
            <div class="d-flex align-center gap-4">
              <div class="text-left">
                <span v-if="selectedIds.length === 0" style="font-size:21px; font-weight:bold">
                  Daftar Diskon
                </span>
                <span v-else class="font-weight-bold text-red font-inter d-flex align-center text-subtitle-1 lh-tight">
                  <v-icon icon="mdi-check-circle" color="red" class="mr-1" size="20"></v-icon>
                  {{ selectedIds.length }} Terpilih
                </span>
                <span class="text-caption text-neutral-medium font-weight-medium d-block mt-0.5" style="font-size:14px">
                  Total jumlah diskon: {{ filteredDiscounts.length }}
                </span>
              </div>

              <v-btn v-if="selectedIds.length > 0" color="red-darken-1" variant="flat" size="small" class="rounded-pill px-4 text-none text-white font-weight-medium" prepend-icon="mdi-delete-sweep-outline" elevation="0" @click="bulkDeleteDiscounts">
                Hapus Terpilih
              </v-btn>
            </div>
            
            <div class="d-flex align-center gap-3 search-action-wrapper">
              <v-text-field v-model="searchQuery" placeholder="Cari nama diskon..." variant="outlined" density="compact" color="#2bb673" prepend-inner-icon="mdi-magnify" hide-details single-line class="search-input" clearable></v-text-field>
              <v-btn color="#2bb673" size="small" class="rounded-pill px-4 text-none text-white font-weight-medium height-compact-btn" prepend-icon="mdi-plus" elevation="0" @click="openAddDialog">
                Tambah diskon
              </v-btn>
            </div>
          </div>

          <div>
            <div v-if="filteredDiscounts.length === 0" class="pa-12 text-center text-neutral-medium">
              <v-icon icon="mdi-text-search" size="48" color="grey-lighten-1" class="mb-2"></v-icon>
              <p class="font-weight-medium">Diskon dengan nama "{{ searchQuery }}" tidak ditemukan.</p>
            </div>

            <v-table v-else class="m3-table">
              <thead>
                <tr>
                  <th class="text-left py-4 pl-4" style="width: 50px;">
                    <v-checkbox :model-value="isAllSelected" :indeterminate="isSomeSelected" color="#2bb673" hide-details density="compact" @click.stop="toggleSelectAll"></v-checkbox>
                  </th>
                  <th class="text-left font-weight-bold py-4">NAMA DISKON</th>
                  <th class="text-left font-weight-bold py-4">NILAI</th>
                  <th class="text-center font-weight-bold py-4 pr-6" style="width: 120px;">AKSI</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filteredDiscounts" :key="item.id" :class="{ 'bg-selected-row': selectedIds.includes(item.id) }">
                  <td class="pl-4 py-4">
                    <v-checkbox v-model="selectedIds" :value="item.id" color="#2bb673" hide-details density="compact"></v-checkbox>
                  </td>
                  <td class="font-weight-medium text-neutral-dark py-4">{{ item.name }}</td>
                  <td class="py-4 font-weight-bold text-success-dark">
                    {{ item.value }}{{ item.type === 'percentage' ? '%' : ' Rp' }}
                  </td>
                  <td class="text-center pr-6 py-4">
                    <v-btn icon="mdi-pencil-outline" variant="text" color="amber-darken-3" size="small" class="mr-1" @click="openEditDialog(item)"></v-btn>
                    <v-btn icon="mdi-delete-outline" variant="text" color="red-darken-1" size="small" @click="openDeleteDialog(item)"></v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </v-card>

        <div class="mt-8 text-body-2 text-neutral-light font-weight-medium text-left">
          2024 © <span class="text-neutral-medium font-weight-bold">PT Nusantara Berkah Digital</span>
        </div>
      </div>

      <v-dialog v-model="dialog" max-width="460" persistent>
        <v-card class="rounded-xl pa-4 dialog-card" elevation="12">
          <div class="d-flex justify-space-between align-center px-2 pt-2 mb-4">
            <span class="text-h5 font-weight-bold text-neutral-dark font-inter">
              {{ isEditMode ? 'Ubah Diskon' : 'Tambah Diskon' }}
            </span>
            <v-btn icon="mdi-close" variant="text" color="grey-darken-2" size="small" @click="closeDialog"></v-btn>
          </div>

          <v-card-text class="pa-2">
            <v-form ref="formRef" v-model="isFormValid" lazy-validation>
              <div class="mb-2">
                <label class="text-caption font-weight-bold text-grey-darken-2 d-block mb-1">Nama Diskon</label>
                <v-text-field v-model="formData.name" placeholder="Misal: Diskon opening" variant="outlined" color="#2bb673" density="comfortable" persistent-placeholder :rules="[v => !!v || 'Nama diskon tidak boleh kosong.', v => !backendError || backendError]" @input="backendError = ''">
                  <template v-slot:append-inner v-if="(!formData.name && formTouched) || backendError">
                    <v-icon color="#ff4d4d" icon="mdi-information"></v-icon>
                  </template>
                </v-text-field>
              </div>

              <div>
                <label class="text-caption font-weight-bold text-grey-darken-2 d-block mb-1">Diskon</label>
                <div class="d-flex gap-3 align-start mb-6">
                  <v-text-field v-model.number="formData.value" type="number" variant="outlined" color="#2bb673" density="comfortable" :suffix="discountType === 'percentage' ? '%' : 'Rp'" :rules="[v => v !== null && v !== '' || 'Diskon tidak boleh kosong.']" class="flex-grow-1"></v-text-field>
                  <div class="toggle-segmented d-flex rounded-lg">
                    <button type="button" class="toggle-item" :class="{ active: discountType === 'percentage' }" @click="discountType = 'percentage'">%</button>
                    <button type="button" class="toggle-item" :class="{ active: discountType === 'nominal' }" @click="discountType = 'nominal'">Rp</button>
                  </div>
                </div>
              </div>

              <v-btn color="#2bb673" size="large" block class="rounded-pill text-none text-white font-weight-medium py-6" elevation="0" @click="submitForm">Simpan</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>


<v-dialog v-model="deleteDialog" max-width="460">
  <v-card class="pa-4 rounded-xl">
    <v-card-title class="font-weight-bold">Hapus Diskon</v-card-title>
    <v-card-text>
      Apakah Anda yakin ingin menghapus diskon <b>{{ itemToDelete?.name }}</b>?
      <div class="text-caption text-grey mt-2">• Diskon yang dihapus tidak bisa dikembalikan lagi.</div>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn variant="outlined" class="rounded-pill" @click="deleteDialog = false">Batalkan</v-btn>
      <v-btn color="error" variant="flat" class="rounded-pill" @click="confirmDelete">Hapus</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>


<v-snackbar v-model="snackbar.show" color="#2c6e63" timeout="3000">
  {{ snackbar.text }}
</v-snackbar>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const stores = ref([
  { id: 'store_1', name: 'Kopi Anak Bangsa' }
]);

const currentStore = ref(stores.value[0]);

const discounts = ref([]); 
const dialog = ref(false);
const isFormValid = ref(false);
const formTouched = ref(false);
const formRef = ref(null);
const discountType = ref('percentage');
const formData = ref({ name: '', value: null });

const isEditMode = ref(false);
const editId = ref(null);
const backendError = ref(''); 
const searchQuery = ref('');
const selectedIds = ref([]);

const deleteDialog = ref(false);
const bulkDeleteDialog = ref(false);
const itemToDelete = ref(null);
const snackbar = ref({ show: false, text: '' });

const API_URL = 'https://6a26a8c7a84f9d39e907a155.mockapi.io/diskon';

const loadDiscounts = async () => {
  try {
    const res = await fetch(`${API_URL}?store_id=${currentStore.value.id}`);
    discounts.value = await res.json();
    selectedIds.value = []; 
  } catch (error) {
    console.error("Gagal memuat data:", error);
  }
};

const switchStore = (store) => {
  currentStore.value = store;
  searchQuery.value = ''; // Reset keyword pencarian
  loadDiscounts(); // Ambil ulang data dari database
};

const filteredDiscounts = computed(() => {
  const sorted = [...discounts.value].sort((a, b) => Number(b.id) - Number(a.id));

  if (!searchQuery.value) return sorted;
  
  return sorted.filter(item => 
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const isAllSelected = computed(() => filteredDiscounts.value.length > 0 && selectedIds.value.length === filteredDiscounts.value.length);
const isSomeSelected = computed(() => selectedIds.value.length > 0 && selectedIds.value.length < filteredDiscounts.value.length);

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = [];
  } else {
    selectedIds.value = filteredDiscounts.value.map(item => item.id);
  }
};

const openAddDialog = () => { isEditMode.value = false; dialog.value = true; };
const openEditDialog = (item) => {
  isEditMode.value = true;
  editId.value = item.id;
  formData.value = { name: item.name, value: item.value };
  discountType.value = item.type;
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  formTouched.value = false;
  backendError.value = '';
  editId.value = null;
  formData.value = { name: '', value: null };
};

const submitForm = async () => {
  formTouched.value = true;
  backendError.value = '';
  
  const { valid } = await formRef.value.validate();
  if (valid) {
    try {
      const inputName = formData.value.name ? formData.value.name.trim().toLowerCase() : '';

      const isDuplicate = discounts.value.some(item => {
        if (!item.name) return false;

        if (isEditMode.value && String(item.id) === String(editId.value)) {
          return false;
        }

        return item.name.trim().toLowerCase() === inputName;
      });

      if (isDuplicate) {
        backendError.value = 'Nama diskon sudah digunakan.';
        await formRef.value.validate(); 
        return; 
      }
      const url = isEditMode.value ? `${API_URL}/${editId.value}` : API_URL;
      const method = isEditMode.value ? 'PUT' : 'POST';

      const res = await fetch(url, {
  method: method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    store_id: "store_1", 
    name: formData.value.name.trim(),
    value: formData.value.value,
    type: discountType.value
  })
});

      if (res.ok) {
        loadDiscounts(); 
        closeDialog();
      }
    } catch (error) {
      console.error(error);
    }
  }
};

const openDeleteDialog = (item) => {
  itemToDelete.value = item;
  deleteDialog.value = true;
};

const confirmDelete = async () => {
  await fetch(`${API_URL}/${itemToDelete.value.id}`, { method: 'DELETE' });
  snackbar.value = { show: true, text: `${itemToDelete.value.name} berhasil dihapus.` };
  loadDiscounts();
  deleteDialog.value = false;
};

const bulkDeleteDiscounts = async () => {
  await Promise.all(selectedIds.value.map(id => fetch(`${API_URL}/${id}`, { method: 'DELETE' })));
  snackbar.value = { show: true, text: `${selectedIds.value.length} diskon berhasil dihapus.` };
  selectedIds.value = [];
  loadDiscounts();
};

onMounted(() => { loadDiscounts(); });
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
.font-inter { font-family: 'Inter', sans-serif !important; }
.bg-window { background-color: #ffffff !important; }
.main-wrapper { width: 100%; max-width: 1000px; margin-top: 20px; }
.text-neutral-dark { color: #1e1e1e !important; }
.text-neutral-medium { color: #666666 !important; }
.text-neutral-light { color: #a0a0a0 !important; }
.text-success-dark { color: #2bb673 !important; }
.dropdown-store { border-color: #cbd5e1 !important; text-transform: none; }
.content-card, .table-card { background-color: #ffffff !important; border: 1px solid #e2e8f0 !important; border-radius: 12px !important; min-height: 440px; width: 100%; overflow: hidden; }
.border-bottom-grey { border-bottom: 1px solid #e2e8f0; }
.max-width-text { max-width: 420px; color: #64748b !important; }
.bg-selected-row { background-color: #f1fbf7 !important; }
.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }
.search-action-wrapper { width: 100%; max-width: 500px; justify-content: flex-end; }
.search-input { max-width: 260px; background-color: #f8fafc; border-radius: 8px; }
:deep(.search-input .v-field__outline) { border-color: #cbd5e1 !important; }
.height-compact-btn { height: 40px !important; }
.lh-tight { line-height: 1.2 !important; }
.mt-1 { margin-top: 2px !important; }
.illustration-container { display: flex; justify-content: center; align-items: center; width: 100%; }
.coupon-bg-oval { width: 260px; height: 140px; background-color: #ff6b81; border-radius: 50%; display: flex; align-items: center; justify-content: center; position: relative; gap: 2px; }
.coupon-half { width: 85px; height: 65px; background-color: #ffca28; display: flex; align-items: center; justify-content: center; position: relative; }
.left-side { border-radius: 8px 0 0 8px; transform: rotate(-6deg) translateY(4px); }
.right-side { border-radius: 0 8px 8px 0; transform: rotate(6deg) translateY(4px); }
.coupon-divider-line { height: 55px; border-left: 3px dashed #ffffff; z-index: 5; transform: translateY(4px); }
.toggle-segmented { border: 1px solid #cbd5e1; overflow: hidden; height: 44px; }
.toggle-item { padding: 0 20px; height: 100%; font-size: 14px; font-weight: 600; color: #475569; background-color: #ffffff; border: none; cursor: pointer; display: flex; align-items: center; }
.toggle-item.active { background-color: #e8f5e9; color: #2bb673; }
.toggle-item:not(:last-child) { border-right: 1px solid #cbd5e1; }
:deep(.v-checkbox .v-selection-control) { min-height: unset !important; }
:deep(.v-messages__message) { color: #ff4d4d !important; font-size: 13px !important; font-weight: 500; margin-top: 4px; }
:deep(.v-field--error:not(.v-field--disabled) .v-label.v-field-label) { color: #ff4d4d !important; }
:deep(.v-field--error .v-outline) { color: #ff4d4d !important; }
</style>
