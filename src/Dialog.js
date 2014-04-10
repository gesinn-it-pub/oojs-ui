/**
 * Modal dialog window.
 *
 * @abstract
 * @class
 * @extends OO.ui.Window
 *
 * @constructor
 * @param {Object} [config] Configuration options
 * @cfg {boolean} [footless] Hide foot
 * @cfg {string} [size='large'] Symbolic name of dialog size, `small`, `medium` or `large`
 */
OO.ui.Dialog = function OoUiDialog( config ) {
	// Configuration initialization
	config = $.extend( { 'size': 'large' }, config );

	// Parent constructor
	OO.ui.Dialog.super.call( this, config );

	// Properties
	this.visible = false;
	this.footless = !!config.footless;
	this.size = null;
	this.onWindowMouseWheelHandler = OO.ui.bind( this.onWindowMouseWheel, this );
	this.onDocumentKeyDownHandler = OO.ui.bind( this.onDocumentKeyDown, this );

	// Events
	this.$element.on( 'mousedown', false );
	this.connect( this, { 'opening': 'onOpening' } );

	// Initialization
	this.$element.addClass( 'oo-ui-dialog' );
	this.setSize( config.size );
};

/* Setup */

OO.inheritClass( OO.ui.Dialog, OO.ui.Window );

/* Static Properties */

/**
 * Symbolic name of dialog.
 *
 * @abstract
 * @static
 * @inheritable
 * @property {string}
 */
OO.ui.Dialog.static.name = '';

/**
 * Map of symbolic size names and CSS classes.
 *
 * @static
 * @inheritable
 * @property {Object}
 */
OO.ui.Dialog.static.sizeCssClasses = {
	'small': 'oo-ui-dialog-small',
	'medium': 'oo-ui-dialog-medium',
	'large': 'oo-ui-dialog-large'
};

/* Methods */

/**
 * Handle close button click events.
 */
OO.ui.Dialog.prototype.onCloseButtonClick = function () {
	this.close( { 'action': 'cancel' } );
};

/**
 * Handle window mouse wheel events.
 *
 * @param {jQuery.Event} e Mouse wheel event
 */
OO.ui.Dialog.prototype.onWindowMouseWheel = function () {
	return false;
};

/**
 * Handle document key down events.
 *
 * @param {jQuery.Event} e Key down event
 */
OO.ui.Dialog.prototype.onDocumentKeyDown = function ( e ) {
	switch ( e.which ) {
		case OO.ui.Keys.PAGEUP:
		case OO.ui.Keys.PAGEDOWN:
		case OO.ui.Keys.END:
		case OO.ui.Keys.HOME:
		case OO.ui.Keys.LEFT:
		case OO.ui.Keys.UP:
		case OO.ui.Keys.RIGHT:
		case OO.ui.Keys.DOWN:
			// Prevent any key events that might cause scrolling
			return false;
	}
};

/**
 * Handle frame document key down events.
 *
 * @param {jQuery.Event} e Key down event
 */
OO.ui.Dialog.prototype.onFrameDocumentKeyDown = function ( e ) {
	if ( e.which === OO.ui.Keys.ESCAPE ) {
		this.close( { 'action': 'cancel' } );
		return false;
	}
};

/** */
OO.ui.Dialog.prototype.onOpening = function () {
	this.$element.addClass( 'oo-ui-dialog-open' );
};

/**
 * Set dialog size.
 *
 * @param {string} [size='large'] Symbolic name of dialog size, `small`, `medium` or `large`
 */
OO.ui.Dialog.prototype.setSize = function ( size ) {
	var name, state, cssClass,
		sizeCssClasses = OO.ui.Dialog.static.sizeCssClasses;

	if ( !sizeCssClasses[size] ) {
		size = 'large';
	}
	this.size = size;
	for ( name in sizeCssClasses ) {
		state = name === size;
		cssClass = sizeCssClasses[name];
		this.$element.toggleClass( cssClass, state );
		if ( this.frame.$content ) {
			this.frame.$content.toggleClass( cssClass, state );
		}
	}
};

/**
 * @inheritdoc
 */
OO.ui.Dialog.prototype.initialize = function () {
	// Parent method
	OO.ui.Window.prototype.initialize.call( this );

	// Properties
	this.closeButton = new OO.ui.ButtonWidget( {
		'$': this.$,
		'frameless': true,
		'icon': 'close',
		'title': OO.ui.msg( 'ooui-dialog-action-close' )
	} );

	// Events
	this.closeButton.connect( this, { 'click': 'onCloseButtonClick' } );
	this.frame.$document.on( 'keydown', OO.ui.bind( this.onFrameDocumentKeyDown, this ) );

	// Initialization
	this.frame.$content.addClass( 'oo-ui-dialog-content' );
	if ( this.footless ) {
		this.frame.$content.addClass( 'oo-ui-dialog-content-footless' );
	}
	this.closeButton.$element.addClass( 'oo-ui-window-closeButton' );
	this.$head.append( this.closeButton.$element );
};

/**
 * @inheritdoc
 */
OO.ui.Dialog.prototype.setup = function ( data ) {
	// Parent method
	OO.ui.Window.prototype.setup.call( this, data );

	// Prevent scrolling in top-level window
	this.$( window ).on( 'mousewheel', this.onWindowMouseWheelHandler );
	this.$( document ).on( 'keydown', this.onDocumentKeyDownHandler );
};

/**
 * @inheritdoc
 */
OO.ui.Dialog.prototype.teardown = function ( data ) {
	// Parent method
	OO.ui.Window.prototype.teardown.call( this, data );

	// Allow scrolling in top-level window
	this.$( window ).off( 'mousewheel', this.onWindowMouseWheelHandler );
	this.$( document ).off( 'keydown', this.onDocumentKeyDownHandler );
};

/**
 * @inheritdoc
 */
OO.ui.Dialog.prototype.close = function ( data ) {
	var dialog = this;
	if ( !dialog.opening && !dialog.closing && dialog.visible ) {
		// Trigger transition
		dialog.$element.removeClass( 'oo-ui-dialog-open' );
		// Allow transition to complete before actually closing
		setTimeout( function () {
			// Parent method
			OO.ui.Window.prototype.close.call( dialog, data );
		}, 250 );
	}
};
