define(function(){"use strict";var a={data:{},instanceName:"category",newCategoryTitle:"sulu.category.new-category"},b={detailsFromSelector:"#category-form",lastClickedCategorySettingsKey:"categoriesLastClicked"};return{layout:{},templates:["/admin/category/template/category/form/details"],initialize:function(){this.options=this.sandbox.util.extend(!0,{},a,this.options),this.saved=!0,this.locale=this.options.locale,this.prepareData(this.options.data),this.bindCustomEvents(),this.render(),this.data.id&&this.sandbox.sulu.saveUserSetting(b.lastClickedCategorySettingsKey,this.data.id)},prepareData:function(a){this.data=a,this.data.defaultLocale===this.data.locale&&this.data.locale!==this.locale&&(this.fallbackData={locale:this.data.locale,name:this.data.name},this.data.name=null),this.data.locale=this.locale},bindCustomEvents:function(){this.sandbox.on("sulu.header.back",function(){this.sandbox.emit("sulu.category.categories.list")}.bind(this)),this.sandbox.on("sulu.header.language-changed",this.changeLanguage.bind(this)),this.sandbox.on("sulu.toolbar.save",this.saveDetails.bind(this)),this.sandbox.on("sulu.toolbar.delete",this.deleteCategory.bind(this)),this.sandbox.on("sulu.category.categories.changed",this.changeHandler.bind(this))},changeLanguage:function(a){this.locale=a.id},render:function(){var a=this.sandbox.translate("sulu.category.category-name");this.fallbackData&&(a=this.fallbackData.locale.toUpperCase()+": "+this.fallbackData.name),this.sandbox.dom.html(this.$el,this.renderTemplate("/admin/category/template/category/form/details",{placeholder:a})),this.sandbox.form.create(b.detailsFromSelector),this.sandbox.form.setData(b.detailsFromSelector,this.data).then(function(){this.bindDomEvents()}.bind(this))},changeHandler:function(a){this.prepareData(a),this.sandbox.form.setData(b.detailsFromSelector,this.data)},bindDomEvents:function(){this.sandbox.dom.on(b.detailsFromSelector,"change keyup",function(){this.saved===!0&&(this.sandbox.emit("sulu.header.toolbar.item.enable","save",!1),this.saved=!1)}.bind(this))},deleteCategory:function(){this.data.id&&this.sandbox.emit("sulu.category.categories.delete",[this.data.id],null,function(){this.sandbox.sulu.unlockDeleteSuccessLabel(),this.sandbox.emit("sulu.category.categories.list")}.bind(this))},saveDetails:function(a){if(this.sandbox.form.validate(b.detailsFromSelector)){var c=this.sandbox.form.getData(b.detailsFromSelector);this.data=this.sandbox.util.extend(!0,{},this.data,c),this.sandbox.emit("sulu.header.toolbar.item.loading","save"),this.sandbox.emit("sulu.category.categories.save",this.data,this.savedCallback.bind(this,!this.data.id,a))}},savedCallback:function(a,b,c,d){d===!0?(this.sandbox.emit("sulu.header.toolbar.item.disable","save",!0),this.saved=!0,"back"===b?this.sandbox.emit("sulu.category.categories.list"):"new"===b?this.sandbox.emit("sulu.category.categories.form-add",this.options.parent):a===!0&&this.sandbox.emit("sulu.category.categories.form",c.id),this.sandbox.emit("sulu.labels.success.show","labels.success.category-save-desc","labels.success")):(this.sandbox.emit("sulu.header.toolbar.item.enable","save",!1),1===c.code?this.sandbox.emit("sulu.labels.error.show","labels.error.category-unique-key","labels.error"):this.sandbox.emit("sulu.labels.error.show","labels.success.category-save-error","labels.error"))}}});