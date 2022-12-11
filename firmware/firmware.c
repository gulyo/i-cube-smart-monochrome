#include <mcs51/stc12.h>

#define LENGTH          8
#define SCREEN_SIZE     LENGTH * LENGTH  // LENGTH * LENGTH

#define CPU_CLK_HZ 23962000L
#define BAUD 115200L
#define BAUD_CLKS (CPU_CLK_HZ / 16 / BAUD)

volatile unsigned char counter = 0;

volatile unsigned char reset_counter = 0;

volatile unsigned char wait_a, wait_b;

void clear_display() {
	P1 = 0xFF;
	P0 = 0xFF;
	P2 = 0x00;
}

/*@formatter:off*/
void uart_isr() __interrupt (4)
{
//	clear_display();
	if (RI)	{
		RI = 0;
		P0 = ~(0xFF & SBUF);
		P2 = 1 << (counter % LENGTH);
		P2 = 0x00;
		if(!(++counter % LENGTH)) P1 = ~( 0x01 << (counter / LENGTH) - 1);
		counter %= SCREEN_SIZE;
		reset_counter = 0;
		for (wait_a = 12; wait_a; --wait_a) for (wait_b = 4; wait_b; --wait_b);
		P1 = 0xFF;
	}
	else {
		++reset_counter;
		if (!reset_counter) counter = 0;
	}
}
/*@formatter:on*/

void init() {
	PCON |= 0x80;				//Doubled baud rate
	SCON = 0x50;        //8bit and variable baudrate, 1 stop __bit, no parity
	AUXR |= 0x04;       //BRT's clock is Fosc (1T) - page 64
	BRT = (256 - BAUD_CLKS) & 0xFF;         //115200 BAUD 0xF3
	AUXR |= 0x01;       //Use BRT as baudrate generator - page 64
	PS = 1;							//Giving the serial interrupt high priority (I don't want to lose information)
	AUXR |= 0x10;       //BRT running

	// https://openlabpro.com/guide/timers-8051/
	// https://microcontrollerslab.com/interrupts-8051-microcontroller/
	// https://microcontrollerslab.com/8051-timer-generate-delay/
	// https://microcontrollerslab.com/serial-communication-8051-keil/
	// https://technobyte.org/interrupts-8051-microcontroller-types-examples/#What_happens_inside_the_microcontroller_when_an_interrupt_occurs
	// https://techetrx.com/8051-microcontroller-tutorials/8051-microcontroller-timers-counters-programming/
	// setup timer0
//	TMOD = 0x00;
//
//	TH1 = 0x00;
//	TL1 = 0x00;
//	TR1 = 0;
//	ET1 = 0;
//	
//	TF0 = 0;
//	TH0 = 0x00;
//	TL0 = 0x00;
//	TR0 = 0;
//	ET0 = 0;

	ES = 1;  // enable UART interrupt
	EA = 1;  // enable global interrupts
}

void main() {
	init();
	while ( 1 );
}
