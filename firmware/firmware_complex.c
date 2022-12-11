
#include <mcs51/stc12.h>

#define LENGTH          8
#define BRIGHT_BIT      3  // In refresh_screen() I have to calculate actual P0 bytes => to make it more effective,
// I write "static" code (repeating similar code chunks instead of for-s and if-s
#define SCREEN_SIZE     64  // LENGTH * LENGTH
#define STATE_SIZE      192  // BRIGHT_BIT * LENGTH * LENGTH
#define LEVEL_DELAY     8

#define FORCED_REFRESH  8  // refreshing is needed during reading to ensure "continuous" light

#define MAX_BUFFER      128     // UART ring buffer size

__xdata volatile unsigned char state[2][BRIGHT_BIT][LENGTH][LENGTH];
volatile unsigned char (*display)[BRIGHT_BIT][LENGTH][LENGTH], (*input)[BRIGHT_BIT][LENGTH][LENGTH];
volatile __bit state_counter = 0;

volatile unsigned char y, z;

volatile unsigned int p_counter = 0, sub_counter = 0;
volatile unsigned char refresh_counter = 0;

volatile __bit keep_clear = 1;

__xdata volatile unsigned char rx_buffer[MAX_BUFFER];
volatile int rx_read = 0;
volatile int rx_write = 0;
volatile int rx_in = 0;

/*@formatter:off*/
// interrupt driven uart with ring buffer
void uart_isr() __interrupt (4)
{
	EA = 0;
	if (RI) // received a byte
	{
		RI = 0; // Clear receive interrupt flag

		if (!(rx_write == rx_read && rx_in > 0)) {
			rx_buffer[rx_write] = SBUF;
			rx_write = ++rx_write % MAX_BUFFER;
			rx_in++;
		}
	}

	EA = 1;
}
/*@formatter:on*/

// check if a byte is available in uart receive buffer
// returns -1 if not, otherwise - the byte value [non blocking]
int recv_uart() {
	int value;
	EA = 0;

	if ( rx_in == 0 ) {
		value = -1;
	} else {
		value = rx_buffer[ rx_read ];
		rx_read = ++rx_read % MAX_BUFFER;
		rx_in--;
	}

	EA = 1;
	return value;
}

// Blocks until a byte is received from UART; returns the byte
unsigned char read_serial() {
	int value;
	while (( value = recv_uart()) == -1 ) {
		__asm__("nop");
	}
	return ( unsigned char ) ( value & 0xFF );
}

// Some magic wait - as in original code:
void delay5us() {
	unsigned char a, b;
	for ( b = 7; b > 0; b-- )
		for ( a = 2; a > 0; a-- );
}

void delay( unsigned int i ) {
	while ( i-- ) {
		delay5us();
	}
}

// Clear the screen (removes artifacts/ghosting):
void clear_display() {
	P1 = 0xFF;
	P0 = 0xFF;
	P2 = 0x00;
}

void refresh_display() {
	if ( keep_clear ) return;

	for ( y = 0x00; y < LENGTH; ++y ) {
		clear_display();
		switch ( refresh_counter ) {
			// brightness 0 is just zero on all levels :)
			case 0:
				for ( z = 0x00; z < LENGTH; ++z ) {
					P0 = ~(( *display )[ 0 ][ y ][ z ] | ( *display )[ 1 ][ y ][ z ] | ( *display )[ 2 ][ y ][ z ] );
					P2 = 1 << z;
					P2 = 0x00;
				}
				break;
			case 1:
				for ( z = 0x00; z < LENGTH; ++z ) {
					P0 = ~(( *display )[ 1 ][ y ][ z ] | ( *display )[ 2 ][ y ][ z ] );
					P2 = 1 << z;
					P2 = 0x00;
				}
				break;
			case 2:
				for ( z = 0x00; z < LENGTH; ++z ) {
					P0 = ~((( *display )[ 0 ][ y ][ z ] & ( *display )[ 1 ][ y ][ z ]) | ( *display )[ 2 ][ y ][ z ] );
					P2 = 1 << z;
					P2 = 0x00;
				}
				break;
			case 3:
				for ( z = 0x00; z < LENGTH; ++z ) {
					P0 = ~(( *display )[ 2 ][ y ][ z ] );
					P2 = 1 << z;
					P2 = 0x00;
				}
				break;
			case 4:
				for ( z = 0x00; z < LENGTH; ++z ) {
					P0 = ~(( *display )[ 0 ][ y ][ z ] & ( *display )[ 2 ][ y ][ z ] );
					P2 = 1 << z;
					P2 = 0x00;
				}
				break;
			case 5:
				for ( z = 0x00; z < LENGTH; ++z ) {
					P0 = ~(( *display )[ 1 ][ y ][ z ] & ( *display )[ 2 ][ y ][ z ] );
					P2 = 1 << z;
					P2 = 0x00;
				}
				break;
			case 6:
				for ( z = 0x00; z < LENGTH; ++z ) {
					P0 = ~(( *display )[ 0 ][ y ][ z ] & ( *display )[ 1 ][ y ][ z ] & ( *display )[ 2 ][ y ][ z ] );
					P2 = 1 << z;
					P2 = 0x00;
				}
				break;
		}
		P1 = ~( 0x01 << y );
		delay( LEVEL_DELAY );
//		delay5us();
	}

	refresh_counter = ++refresh_counter % (( 0x01 << BRIGHT_BIT ) - 1 );
	clear_display();
}

void rotate_state() {
	display = &( state[ state_counter ] );
	state_counter = ++state_counter % 2;
	input = &( state[ state_counter ] );
}

void blink() {
	P0 = 0x55;
	P2 = 0xFF;
	P1 = 0x00;
	delay( 3000 );
	clear_display();
	delay( 10000 );
	P0 = 0xAA;
	P2 = 0xFF;
	P1 = 0x00;
	delay( 3000 );
	clear_display();
}

void init() {
	PCON &= 0x7F;       //Baudrate no doubled
	SCON = 0x50;        //8bit and variable baudrate, 1 stop __bit, no parity
	AUXR |= 0x04;       //BRT's clock is Fosc (1T) - page 64
	BRT = 0xED;        //Set BRT's reload value
	AUXR |= 0x01;       //Use BRT as baudrate generator - page 64
	AUXR |= 0x10;       //BRT running
	
	// setup timer0
	TH0 = 0xc0;     // reload value
	TL0 = 0x00;

	ES = 1;  // enable UART interrupt
	EA = 1;  // enable global interrupts
}

void main() {
	rotate_state();
	unsigned char value;
	
	init();
	
	blink();

	while ( 1 ) {
		// ----- Handling input -----
		if ( rx_in > 0 ) {
			value = read_serial();

			switch ( value ) {
				case 0xF2:
					for ( p_counter = 0x00; p_counter < STATE_SIZE; ++p_counter ) {
						sub_counter = p_counter % SCREEN_SIZE;
						( *input )[ p_counter / SCREEN_SIZE ][ sub_counter / LENGTH ][ sub_counter % LENGTH ] = read_serial();
						if ( !( p_counter % FORCED_REFRESH )) refresh_display();
					}
					rotate_state();
					keep_clear = 0;
					refresh_display();
					break;
				case 0xF5:
					clear_display();
					keep_clear = 1;
					break;
				default:
					refresh_display();
			}
		} else {
			refresh_display();
		}
	}
}