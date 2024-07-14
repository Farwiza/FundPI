import React from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';

const theme = {
  background: '#f5f8fb',
  fontFamily: 'Helvetica, sans-serif',
  headerBgColor: '#6e48aa',
  headerFontColor: '#fff',
  headerFontSize: '16px',
  botBubbleColor: '#6e48aa',
  botFontColor: '#fff',
  userBubbleColor: '#fff',
  userFontColor: '#4a4a4a',
};

const StyledOption = styled.div`
  display: inline-block;
  cursor: pointer;
  border-radius: 30px;
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.userBubbleColor};
  color: ${({ theme }) => theme.userFontColor};
  text-align: center;
  margin: 5px;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.botBubbleColor};
    color: ${({ theme }) => theme.botFontColor};
  }
`;

const Chatbot = () => {
  return (
    <ThemeProvider theme={theme}>
      <div className="fixed bottom-4 right-4 z-50">
        <div className="transition-all duration-300 ease-in-out">
          <ChatBot
            steps={[
              {
                id: '1',
                message: 'Silakan pilih salah satu pertanyaan:',
                trigger: '2',
              },
              {
                id: '2',
                options: [
                  {
                    value: 1,
                    label: 'Bagaimana cara melakukan donate?',
                    trigger: 'donate',
                  },
                  {
                    value: 2,
                    label: 'Bagaimana cara melakukan update campaign?',
                    trigger: 'update_campaign',
                  },
                  {
                    value: 3,
                    label: 'Bagaimana cara melakukan delete campaign?',
                    trigger: 'delete_campaign',
                  },
                  {
                    value: 4,
                    label: 'Bagaimana cara membuat sebuah campaign?',
                    trigger: 'create_campaign',
                  },
                  {
                    value: 5,
                    label: 'Apakah bila kita donate campaign bisa di refund?',
                    trigger: 'refund_policy',
                  },
                  {
                    value: 6,
                    label: 'Kenapa saya tidak bisa membuat campaign?',
                    trigger: 'creation_issue',
                  },
                  {
                    value: 7,
                    label:
                      'Apakah saya harus menghubungkan ke metamask untuk mengakses ke semua fitur?',
                    trigger: 'metamask_connection',
                  },
                  {
                    value: 8,
                    label: 'Apakah ada platform fee dari platfrom ini?',
                    trigger: 'platform_fee',
                  },
                ],
                optionComponent: StyledOption,
              },
              {
                id: 'donate',
                message:
                  'Untuk melakukan donate, silakan ikuti langkah-langkah yang tercantum di halaman campaign.',
                restart: true, // Menambahkan restart: true
              },
              {
                id: 'update_campaign',
                message:
                  'Untuk melakukan update campaign, silakan masuk ke halaman dashboard dan pilih campaign yang ingin Anda update.',
                restart: true, // Menambahkan restart: true
              },
              {
                id: 'delete_campaign',
                message:
                  'Untuk melakukan delete campaign, silakan masuk ke halaman dashboard dan pilih campaign yang ingin Anda hapus.',
                restart: true, // Menambahkan restart: true
              },
              {
                id: 'create_campaign',
                message:
                  'Untuk membuat campaign, silakan masuk ke halaman dashboard dan klik tombol "Buat Campaign Baru".',
                restart: true, // Menambahkan restart: true
              },
              {
                id: 'refund_policy',
                message:
                  'Kebijakan refund tergantung pada kebijakan masing-masing campaign. Silakan lihat detail campaign untuk informasi lebih lanjut.',
                restart: true, // Menambahkan restart: true
              },
              {
                id: 'creation_issue',
                message:
                  'Ada beberapa alasan mengapa Anda mungkin tidak bisa membuat campaign, termasuk batasan akun atau masalah teknis. Silakan hubungi dukungan pelanggan untuk bantuan lebih lanjut.',
                restart: true, // Menambahkan restart: true
              },
              {
                id: 'metamask_connection',
                message:
                  'Ya, Anda harus menghubungkan ke Metamask untuk mengakses fitur pembayaran dan transaksi di platform ini.',
                restart: true, // Menambahkan restart: true
              },
              {
                id: 'platform_fee',
                message:
                  'Ya, ada biaya platform yang dikenakan untuk setiap transaksi. Detail biaya dapat ditemukan di halaman informasi.',
                restart: true, // Menambahkan restart: true
              },
            ]}
            floating={true}
          />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Chatbot;