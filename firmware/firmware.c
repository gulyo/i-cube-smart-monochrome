// Copyright(C) Tomas Uktveris 2015
// www.wzona.info
/*
This firmware.c file was created for a custom-made PCB that uses the STC12C5A60S2 to control an 8x8x8 monochrome LED Matrix.
This is a derivative of the original firmware/v2-sdcc/firmware.c compiled by Tomazas.
Credit goes to EdKeyes (from the Amulius - Embedded Engineering Discord Server) for helping me figure out how to correct frames being skipped.
 */
#include <mcs51/stc12.h>

#define C_COUNT 4
#define LENGTH 8

//volatile unsigned char layer_z = 0;   // Z-layer being re-painted

__xdata volatile unsigned char display[LENGTH][LENGTH];

volatile unsigned char x, y, z;

volatile unsigned int p_counter = 0;
volatile __bit reading = 0;
volatile __bit cleared = 1;

#define MAX_BUFFER  128     // UART ring buffer size

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
void delay5us( void ) {
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
	P2 = 0xFF;
	delay( 1 );
	P2 = 0x00;
}

void refresh_display() {
//	for ( unsigned char cycle = 0; cycle < C_COUNT; ++cycle ) {
	// for ( unsigned char i = 0x00; i < 0x40; ++i ) {
	for ( y = 0x00; y < LENGTH; ++y ) {
		for ( z = 0x00; z < LENGTH; ++z ) {
			P2 = 1 << z;
			P0 = ~display[ y ][ z ];
			delay(1);
		}
		P1 = ~( 1 << y );
		delay(50);
	}
	// }
	clear_display();
	
}

void main() {
//	for ( unsigned char cycle = 0; cycle < C_COUNT; ++cycle ) {
	for ( y = 0; y < LENGTH; ++y ) {
		for ( z = 0; z < LENGTH; ++z ) {
			display[ y ][ z ] = 0x0;
		}
	}
//	}

	unsigned char value;

	// init uart - 19200bps@24.000MHz MCU
	PCON &= 0x7F;       //Baudrate no doubled
	SCON = 0x50;        //8bit and variable baudrate, 1 stop __bit, no parity
	AUXR |= 0x04;       //BRT's clock is Fosc (1T)
	BRT = 0xD9;         //Set BRT's reload value
	AUXR |= 0x01;       //Use BRT as baudrate generator
	AUXR |= 0x10;       //BRT running

	ES = 1;  // enable UART interrupt

	// setup timer0
	TH0 = 0xc0;     // reload value
	TL0 = 0;
	EA = 1;  // enable global interrupts;
	
	P0 = 0x00;
	P2 = 0xFF;
	P1 = 0x00;
	delay(100000);
	clear_display();

	while ( 1 ) {
		// ----- Handling input -----
		if ( rx_in > 0 ) {
			value = read_serial();

//			if ( reading == 1 ) {  // Skip until sync
//				display[ p_counter / LENGTH ][ p_counter % LENGTH ] = value;
//				++p_counter;
//			}
//			if ( reading != 1 ) {
			switch ( value ) {
				case 0xF2:
//						reading = 1;
					for ( y = 0x00; y < LENGTH; ++y ) {
						for ( z = 0x00; z < LENGTH; ++z ) {
							display[ y ][ z ] = read_serial();
						}
					}
					cleared = 0;
					break;
				case 0xF5:
					clear_display();
					cleared = 1;
					break;
			}
//			}
//			if (( reading == 1 ) && ( p_counter == ( LENGTH * LENGTH ))) {
//				reading = 0;
//				p_counter = 0;
//				
//				clear_display();
//				delay(10);
//				cleared = 0;
//			}
		}

		// ----- Refreshing display -----
		if ( !cleared ) {
			refresh_display();
		}
	}
}