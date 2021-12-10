<template>
  <div class="date-panel">
    <date-picker ref="datepicker" v-model="date" :inline="true" :lang="lang" prefix-class="mx" @calendar-change="ChangeMonthOrYear" @change="handleChangeDate($event)"></date-picker>
  </div>
</template>
<script>
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/locale/zh-cn'
import 'vue2-datepicker/index.css'

export default {
  components: {
    DatePicker
  },
  model: {
    prop: 'date',
    event: 'change'
  },
  props: {
    mettingSel: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
      langZh: {
        formatLocale: {
          firstDayOfWeek: 1,
        },
        monthBeforeYear: true
      },
      langEn: {
        formatLocale: {
          months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          weekdaysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
          firstDayOfWeek: 1,
          firstWeekContainsDate: 1
        },
        monthBeforeYear: true,
        yearFormat: 'YYYY'
      },
      date: new Date()
    }
  },
  computed: {
    lang() {
      return this.$i18n.locale === 'en-US' ? this.langEn : this.langZh
    }
  },
  watch: {
    mettingSel(val) {
      if (val) {
        let date = document.querySelectorAll('.mx-table-date .cell:not(.not-current-month) div')
        let notCurrentMonth = document.querySelectorAll('.mx-table-date .cell.not-current-month div')
        notCurrentMonth.forEach(item => {
          item.classList.remove('sel')
        })
        date.forEach((item,index) => {
          //先清除所有红点
          item.classList.remove('sel')
        })
        val.forEach((item, index) => {
          //对应的日期添加红点
          let time1 = new Date(item.replace(/-/g,"/")).getTime()
          let time2 = new Date().getTime()
          let day = new Date(item.replace(/-/g, "/")).getDate()
          if((time2 - time1) < 60 * 60 * 24 * 1000) {
            date[day - 1].classList.add('sel')
          }
        })
      }
    }
  },
  mounted() {
  },
  methods: {
    handleChangeDate(e) {
      this.$emit("change", this.date)
    },
    ChangeMonthOrYear(e){
      this.$emit("change", e)
    }
  },
}
</script>
<style lang="scss">
  @import "@assets/style/datepicker.scss";
</style>
