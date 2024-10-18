mod blob;
mod doc;
mod storage;
mod sync;

use std::path::PathBuf;

use chrono::NaiveDateTime;
use napi::bindgen_prelude::{Buffer, Uint8Array};
use napi_derive::napi;

fn map_err(err: sqlx::Error) -> napi::Error {
  napi::Error::from(anyhow::Error::from(err))
}

#[napi(object)]
pub struct DocUpdate {
  pub doc_id: String,
  pub created_at: NaiveDateTime,
  pub data: Buffer,
}

#[napi(object)]
pub struct DocRecord {
  pub doc_id: String,
  pub data: Buffer,
  pub timestamp: NaiveDateTime,
}

#[napi(object)]
pub struct DocClock {
  pub doc_id: String,
  pub timestamp: NaiveDateTime,
}

#[napi(object)]
pub struct SetBlob {
  pub key: String,
  pub data: Buffer,
  pub mime: String,
}

#[napi(object)]
pub struct Blob {
  pub key: String,
  pub data: Buffer,
  pub mime: String,
  pub size: i64,
  pub created_at: NaiveDateTime,
}

#[napi(object)]
pub struct ListedBlob {
  pub key: String,
  pub size: i64,
  pub mime: String,
  pub created_at: NaiveDateTime,
}

#[napi]
pub struct DocStorage {
  storage: storage::SqliteDocStorage,
}

#[napi]
impl DocStorage {
  #[napi(constructor, async_runtime)]
  pub fn new(path: String) -> napi::Result<Self> {
    Ok(Self {
      storage: storage::SqliteDocStorage::new(path),
    })
  }

  #[napi]
  /// Initialize the database and run migrations.
  /// If `migrations` folder is provided, it should be a path to a directory containing SQL migration files.
  /// If not, it will to try read migrations under './migrations' related to where this program is running(PWD).
  pub async fn init(&self, migrations_folder: Option<String>) -> napi::Result<()> {
    self.storage.connect().await.map_err(map_err)?;
    self
      .storage
      .migrate(
        migrations_folder
          .map(PathBuf::from)
          .unwrap_or_else(|| std::env::current_dir().unwrap().join("migrations")),
      )
      .await
      .map_err(map_err)
  }

  #[napi]
  pub async fn close(&self) -> napi::Result<()> {
    self.storage.close().await;

    Ok(())
  }

  #[napi(getter)]
  pub async fn is_closed(&self) -> napi::Result<bool> {
    Ok(self.storage.is_closed())
  }

  /**
   * Flush the WAL file to the database file.
   * See https://www.sqlite.org/pragma.html#pragma_wal_checkpoint:~:text=PRAGMA%20schema.wal_checkpoint%3B
   */
  #[napi]
  pub async fn checkpoint(&self) -> napi::Result<()> {
    self.storage.checkpoint().await.map_err(map_err)
  }

  #[napi]
  pub async fn push_updates(&self, doc_id: String, updates: Vec<Uint8Array>) -> napi::Result<u32> {
    let updates = updates.iter().map(|u| u.as_ref()).collect::<Vec<_>>();
    self
      .storage
      .push_updates(doc_id, updates)
      .await
      .map_err(map_err)
  }

  #[napi]
  pub async fn get_doc_snapshot(&self, doc_id: String) -> napi::Result<Option<DocRecord>> {
    self.storage.get_doc_snapshot(doc_id).await.map_err(map_err)
  }

  #[napi]
  pub async fn set_doc_snapshot(&self, snapshot: DocRecord) -> napi::Result<bool> {
    self
      .storage
      .set_doc_snapshot(snapshot)
      .await
      .map_err(map_err)
  }

  #[napi]
  pub async fn get_doc_updates(&self, doc_id: String) -> napi::Result<Vec<DocUpdate>> {
    self.storage.get_doc_updates(doc_id).await.map_err(map_err)
  }

  #[napi]
  pub async fn mark_updates_merged(
    &self,
    doc_id: String,
    updates: Vec<NaiveDateTime>,
  ) -> napi::Result<u32> {
    self
      .storage
      .mark_updates_merged(doc_id, updates)
      .await
      .map_err(map_err)
  }

  #[napi]
  pub async fn delete_doc(&self, doc_id: String) -> napi::Result<()> {
    self.storage.delete_doc(doc_id).await.map_err(map_err)
  }

  #[napi]
  pub async fn get_doc_clocks(&self, after: Option<i64>) -> napi::Result<Vec<DocClock>> {
    self.storage.get_doc_clocks(after).await.map_err(map_err)
  }

  #[napi]
  pub async fn get_blob(&self, key: String) -> napi::Result<Option<Blob>> {
    self.storage.get_blob(key).await.map_err(map_err)
  }

  #[napi]
  pub async fn set_blob(&self, blob: SetBlob) -> napi::Result<()> {
    self.storage.set_blob(blob).await.map_err(map_err)
  }

  #[napi]
  pub async fn delete_blob(&self, key: String, permanently: bool) -> napi::Result<()> {
    self
      .storage
      .delete_blob(key, permanently)
      .await
      .map_err(map_err)
  }

  #[napi]
  pub async fn release_blobs(&self) -> napi::Result<()> {
    self.storage.release_blobs().await.map_err(map_err)
  }

  #[napi]
  pub async fn list_blobs(&self) -> napi::Result<Vec<ListedBlob>> {
    self.storage.list_blobs().await.map_err(map_err)
  }

  #[napi]
  pub async fn get_peer_clocks(&self, peer: String) -> napi::Result<Vec<DocClock>> {
    self.storage.get_peer_clocks(peer).await.map_err(map_err)
  }

  #[napi]
  pub async fn set_peer_clock(
    &self,
    peer: String,
    doc_id: String,
    clock: NaiveDateTime,
  ) -> napi::Result<()> {
    self
      .storage
      .set_peer_clock(peer, doc_id, clock)
      .await
      .map_err(map_err)
  }

  #[napi]
  pub async fn get_peer_pushed_clocks(&self, peer: String) -> napi::Result<Vec<DocClock>> {
    self
      .storage
      .get_peer_pushed_clocks(peer)
      .await
      .map_err(map_err)
  }

  #[napi]
  pub async fn set_peer_pushed_clock(
    &self,
    peer: String,
    doc_id: String,
    clock: NaiveDateTime,
  ) -> napi::Result<()> {
    self
      .storage
      .set_peer_pushed_clock(peer, doc_id, clock)
      .await
      .map_err(map_err)
  }
}