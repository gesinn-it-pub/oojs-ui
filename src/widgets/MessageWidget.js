/**
 * MessageWidget produces a visual component for sending a notice to the user
 * with an icon and distinct design noting its purpose. The MessageWidget changes
 * its visual presentation based on the type chosen, which also denotes its UX
 * purpose.
 *
 * @class
 * @extends OO.ui.Widget
 * @mixins OO.ui.mixin.IconElement
 * @mixins OO.ui.mixin.LabelElement
 * @mixins OO.ui.mixin.TitledElement
 * @mixins OO.ui.mixin.FlaggedElement
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {string} [type='notice'] The type of the notice widget. This will also
 *  impact the flags that the widget receives (and hence its CSS design) as well
 *  as the icon that appears. Available types:
 *  'notice', 'error', 'warning', 'success'
 * @cfg {boolean} [inline=false] Set the notice as an inline notice. The default
 *  is not inline, or 'boxed' style.
 * @cfg {boolean} [showClose] Show a close button. Can't be used with inline.
 */
OO.ui.MessageWidget = function OoUiMessageWidget( config ) {
	// Configuration initialization
	config = config || {};

	// Parent constructor
	OO.ui.MessageWidget.super.call( this, config );

	// Mixin constructors
	OO.ui.mixin.IconElement.call( this, config );
	OO.ui.mixin.LabelElement.call( this, config );
	OO.ui.mixin.TitledElement.call( this, config );
	OO.ui.mixin.FlaggedElement.call( this, config );

	// Set type
	this.setType( config.type );
	this.setInline( config.inline );

	// If an icon is passed in, set it again as setType will
	// have overridden the setIcon call in the IconElement constructor
	if ( config.icon ) {
		this.setIcon( config.icon );
	}

	if ( !this.inline && config.showClose ) {
		this.closeButton = new OO.ui.ButtonWidget( {
			classes: [ 'oo-ui-messageWidget-close' ],
			framed: false,
			icon: 'close',
			label: OO.ui.msg( 'ooui-popup-widget-close-button-aria-label' ),
			invisibleLabel: true
		} );
		this.closeButton.connect( this, {
			click: 'onCloseButtonClick'
		} );
		this.$element.addClass( 'oo-ui-messageWidget-showClose' );
	}

	// Build the widget
	this.$element
		.append( this.$icon, this.$label, this.closeButton && this.closeButton.$element )
		.addClass( 'oo-ui-messageWidget' );
};

/* Setup */

OO.inheritClass( OO.ui.MessageWidget, OO.ui.Widget );
OO.mixinClass( OO.ui.MessageWidget, OO.ui.mixin.IconElement );
OO.mixinClass( OO.ui.MessageWidget, OO.ui.mixin.LabelElement );
OO.mixinClass( OO.ui.MessageWidget, OO.ui.mixin.TitledElement );
OO.mixinClass( OO.ui.MessageWidget, OO.ui.mixin.FlaggedElement );

/* Events */

/**
 * @event close
 */

/* Static Properties */

/**
 * An object defining the icon name per defined type.
 *
 * @static
 * @property {Object}
 */
OO.ui.MessageWidget.static.iconMap = {
	notice: 'infoFilled',
	error: 'error',
	warning: 'alert',
	success: 'success'
};

/* Methods */

/**
 * Set the inline state of the widget.
 *
 * @param {boolean} inline Widget is inline
 */
OO.ui.MessageWidget.prototype.setInline = function ( inline ) {
	inline = !!inline;

	if ( this.inline !== inline ) {
		this.inline = inline;
		this.$element
			.toggleClass( 'oo-ui-messageWidget-block', !this.inline );
	}
};
/**
 * Set the widget type. The given type must belong to the list of
 * legal types set by OO.ui.MessageWidget.static.iconMap
 *
 * @param {string} [type='notice']
 */
OO.ui.MessageWidget.prototype.setType = function ( type ) {
	if ( !this.constructor.static.iconMap[ type ] ) {
		type = 'notice';
	}

	if ( this.type !== type ) {
		// Flags
		this.clearFlags();
		this.setFlags( type );

		// Set the icon and its variant
		this.setIcon( this.constructor.static.iconMap[ type ] );
		this.$icon.removeClass( 'oo-ui-image-' + this.type );
		this.$icon.addClass( 'oo-ui-image-' + type );

		if ( type === 'error' ) {
			this.$element.attr( 'role', 'alert' );
			this.$element.removeAttr( 'aria-live' );
		} else {
			this.$element.removeAttr( 'role' );
			this.$element.attr( 'aria-live', 'polite' );
		}

		this.type = type;
	}
};

/**
 * Handle click events on the close button
 *
 * @param {jQuery} e jQuery event
 * @fires close
 */
OO.ui.MessageWidget.prototype.onCloseButtonClick = function () {
	this.toggle( false );
	this.emit( 'close' );
};
