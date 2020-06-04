const vi = {
    badge: 'Huy hiệu',
    close: 'Đóng',
    dataIterator: {
      noResultsText: 'Không tìm thấy dữ liệu',
      loadingText: 'Đang tải...',
    },
    dataTable: {
      itemsPerPageText: 'Số dòng hiển thị:',
      ariaLabel: {
        activateAscending: '',
        sortDescending: ': Sắp xếp nhỏ dần. Nhấn để hủy sắp xếp.',
        sortAscending: ': Sắp xếp tăng dần. Nhấn để sắp xếp nhỏ dần.',
        sortNone: ': Không sắp xếp. Nhấn để sắp xếp tăng dần.',
      },
      sortBy: 'Sắp xếp theo',
    },
    dataFooter: {
      itemsPerPageText: 'Số thành phần hiển thị:',
      itemsPerPageAll: 'Tất cả',
      nextPage: 'Trang tiếp theo',
      prevPage: 'Trang trước',
      firstPage: 'Trang đầu',
      lastPage: 'Trang cuối',
      pageText: '{0}-{1} trong {2}',
    },
    datePicker: {
      itemsSelected: '{0} được chọn',
    },
    noDataText: 'Không có dữ liệu',
    carousel: {
      prev: 'Quay lại',
      next: 'Tiếp theo',
      ariaLabel: {
        delimiter: 'Slide {0} trong {1}',
      },
    },
    calendar: {
      moreEvents: '{0} thêm',
    },
    fileInput: {
      counter: '{0} files',
      counterSize: '{0} files ({1} trong tổng số)',
    },
    timePicker: {
      am: 'AM',
      pm: 'PM',
    },
  }

export default {
    lang: {
      locales: { vi },
      current: 'vi',
    },
    theme: {
      dark: true,
      themes: {
        light: {
          primary: '#FFAB40',
          secondary: '#81C784',
          accent: '#FFAB40',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          menu: '#FFAB40',
          nuxtlink: '#32329f'
        },
        dark: {
          primary: '#F57C00',
          secondary: '#388E3C',
          accent: '#F57C00',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          menu: '#F57C00',
          nuxtlink: '#F57C00'
        },
      },
    }
  }