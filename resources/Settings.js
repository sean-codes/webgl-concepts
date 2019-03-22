class Settings {
   constructor(options){
      options = options || {}
      this.settings = {}
      this.onChange = options.onChange || function() {}

      if (options.settings) {
         for(var setting of options.settings) {
            this.addSetting(setting)
         }
      }
   }

   read(settingName) {
      var setting = this.getSetting(settingName)
      setting.read = true
      return Number(setting.value)
   }

   changed(settingName) {
      return !this.getSetting(settingName).read
   }

   getSetting(settingName) {
      return this.settings[settingName.toLowerCase()]
   }

   add(options) {
      var setting = {
         html: this.createSettingHTML(options),
         value: options.value
      }
      document.querySelector('settings').appendChild(setting.html.container)

      // Listen for update
      setting.html.input.addEventListener('input', () => {
         this.onChangeEvent(setting)
      })

      this.settings[options.name.toLowerCase()] = setting
   }

   onChangeEvent(setting) {
      setting.html.value.innerHTML = setting.html.input.value
      setting.value = setting.html.input.value
      setting.read = false

      this.onChange(setting, this.settings)
   }

   createSettingHTML(setting) {
      var html = {
         container: document.createElement('setting'),
         label: document.createElement('label'),
         input: document.createElement('input'),
         value: document.createElement('value')
      }
      html.container.appendChild(html.label)
      html.container.appendChild(html.input)
      html.container.appendChild(html.value)

      // Label Setup
      html.label.innerHTML = setting.name

      // Range Slider Setup
      html.input.type = 'range'
      html.input.step = setting.step || 1
      html.input.min = setting.min || 0
      html.input.max = setting.max || 100
      html.input.value = setting.value
      html.input.defaultValue = setting.value

      // Value Setup
      html.value.innerHTML = setting.value

      return html
   }
}
